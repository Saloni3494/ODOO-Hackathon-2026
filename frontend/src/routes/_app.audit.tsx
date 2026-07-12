import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auditRows } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/audit")({
  component: Audit,
  head: () => ({ meta: [{ title: "Audit · AssetFlow" }] }),
});

const badge = (v: string) => {
  const map: Record<string, string> = {
    Verified: "bg-primary/15 text-primary border-primary/30",
    Missing: "bg-destructive/15 text-destructive border-destructive/30",
    Damaged: "bg-warning/15 text-warning border-warning/30",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${map[v]}`}>{v}</span>;
};

function Audit() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Asset Audit</h1>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6 space-y-4">
        <div className="rounded-xl border border-border p-4 bg-background/40">
          <div className="text-sm">
            <div className="font-semibold">Q3 audit: Engineering dept – 1-15 jul</div>
            <div className="text-muted-foreground mt-1">Auditors: A. Rao, S, Iqbal</div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Reported location</TableHead>
              <TableHead>Verification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditRows.map((r) => (
              <TableRow key={r.asset}>
                <TableCell>{r.asset}</TableCell>
                <TableCell>{r.reportedLocation}</TableCell>
                <TableCell>{badge(r.verification)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <p className="text-sm">2 assets flagged – discrepancy report generated automatically</p>
        </div>

        <Button onClick={() => toast.success("Audit cycle closed")}>Close audit cycle</Button>
      </Card>
    </div>
  );
}
