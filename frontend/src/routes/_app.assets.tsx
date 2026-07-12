import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { assets, categories, departments } from "@/lib/mock-data";
import { StatusPill } from "@/components/StatusPill";
import { Plus, QrCode, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/assets")({
  component: Assets,
  head: () => ({ meta: [{ title: "Assets · AssetFlow" }] }),
});

function Assets() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () =>
      assets.filter((a) => {
        const matchQ = !q || `${a.tag} ${a.name}`.toLowerCase().includes(q.toLowerCase());
        const matchC = cat === "all" || a.category === cat;
        const matchS = status === "all" || a.status === status;
        return matchQ && matchC && matchS;
      }),
    [q, cat, status]
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assets</h1>
      </div>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by tag, serial, or QR code..." className="pl-9 rounded-full bg-background" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Register Asset</Button></DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle>Register Asset</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input className="mt-1" /></div>
                <div><Label>Category</Label>
                  <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Location</Label><Input className="mt-1" /></div>
              </div>
              <DialogFooter><Button onClick={() => { toast.success("Asset registered"); setOpen(false); }}>Register</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4 flex gap-3 flex-wrap">
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>QR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.tag}>
                  <TableCell className="font-mono text-xs">{a.tag}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.category}</TableCell>
                  <TableCell><StatusPill status={a.status} /></TableCell>
                  <TableCell>{a.location}</TableCell>
                  <TableCell><QrCode className="h-4 w-4 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
