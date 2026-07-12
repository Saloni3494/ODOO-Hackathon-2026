import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assets, employees } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/allocation")({
  component: Allocation,
  head: () => ({ meta: [{ title: "Allocation & Transfer · AssetFlow" }] }),
});

const history = [
  { date: "Mar 12", text: "Allocated to Priya shah – Engineering" },
  { date: "Jan 09", text: "Returned by Arjun Nair – condition: good" },
];

function Allocation() {
  const [assetTag, setAssetTag] = useState("AF-0114");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const asset = assets.find((a) => a.tag === assetTag);
  const conflict = asset?.status === "Allocated";

  const submit = () => {
    if (!to || !reason) return toast.error("Fill all fields");
    toast.success("Transfer request submitted");
    setReason("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Allocation & Transfer</h1>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6 space-y-4">
        <div>
          <Label>Asset</Label>
          <Select value={assetTag} onValueChange={setAssetTag}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{assets.map((a) => <SelectItem key={a.tag} value={a.tag}>{a.tag} – {a.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {conflict && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Already Allocated to Priya Shah (Engineering)</p>
              <p className="text-muted-foreground mt-1">Direct re-allocation is blocked – submit a Transfer request below</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold">Transfer Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <Label>From</Label>
              <Select disabled defaultValue="priya">
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="priya">Priya Shah</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label>To</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select Employee..." /></SelectTrigger>
                <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label>Reason</Label>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={5} className="mt-1 bg-background" />
        </div>

        <div className="flex gap-3">
          <Button onClick={submit}>Submit Request</Button>
          <Button variant="outline" onClick={() => toast.success("Return recorded")}>Return</Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold">Allocation history</h3>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {history.map((h) => (
              <div key={h.date}><span className="text-foreground font-medium">{h.date}</span> — {h.text}</div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
