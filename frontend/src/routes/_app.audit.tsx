import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { listAuditCyclesFn, closeAuditCycleFn } from "../server-functions";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/_app/audit")({
  component: Audit,
  loader: async () => {
    return listAuditCyclesFn();
  },
  head: () => ({ meta: [{ title: "Audit · AssetFlow" }] }),
});

const badge = (v: string) => {
  const map: Record<string, string> = {
    VERIFIED: "bg-primary/15 text-primary border-primary/30",
    MISSING: "bg-destructive/15 text-destructive border-destructive/30",
    DAMAGED: "bg-warning/15 text-warning border-warning/30",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${map[v] || 'bg-muted text-muted-foreground'}`}>{v}</span>;
};

function Audit() {
  const auditCycles = Route.useLoaderData();
  const router = useRouter();
  const closeAuditCycle = useServerFn(closeAuditCycleFn);
  const { can } = useAuth();

  // For the hackathon demo, we just show the first active or most recent cycle
  const activeCycle = auditCycles[0];

  const handleClose = async () => {
    if (!activeCycle) return;
    try {
      await closeAuditCycle({ data: { id: activeCycle.id } });
      toast.success("Audit cycle closed");
      router.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to close audit cycle");
    }
  };

  if (!activeCycle) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Asset Audit</h1>
        <Card className="mt-6 bg-card border-border rounded-2xl p-12 text-center text-muted-foreground">
          No audit cycles found in the system.
        </Card>
      </div>
    );
  }

  const discrepancyCount = activeCycle.results?.filter((r: any) => r.status !== "VERIFIED").length || 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Asset Audit</h1>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6 space-y-4">
        <div className="rounded-xl border border-border p-4 bg-background/40 flex justify-between items-center">
          <div className="text-sm">
            <div className="font-semibold">{activeCycle.name}</div>
            <div className="text-muted-foreground mt-1">
              Dates: {new Date(activeCycle.startDate).toLocaleDateString()} to {new Date(activeCycle.endDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${activeCycle.status === 'CLOSED' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/10 text-primary'}`}>
              {activeCycle.status}
            </span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Verification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeCycle.results?.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.asset?.assetTag}</TableCell>
                <TableCell>{r.asset?.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{r.notes || "—"}</TableCell>
                <TableCell>{badge(r.status)}</TableCell>
              </TableRow>
            ))}
            {(!activeCycle.results || activeCycle.results.length === 0) && (
               <TableRow>
                 <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No audit results logged yet.</TableCell>
               </TableRow>
            )}
          </TableBody>
        </Table>

        {discrepancyCount > 0 && (
          <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="text-sm">{discrepancyCount} assets flagged – discrepancy report generated automatically</p>
          </div>
        )}

        {activeCycle.status !== 'CLOSED' && can('RESOLVE_AUDIT') && (
          <Button onClick={handleClose}>Close audit cycle</Button>
        )}
      </Card>
    </div>
  );
}
