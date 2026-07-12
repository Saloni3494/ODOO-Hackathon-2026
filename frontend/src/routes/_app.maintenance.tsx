import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { listMaintenanceRequestsFn, updateMaintenanceStageFn } from "../server-functions";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/_app/maintenance")({
  component: Maintenance,
  loader: async () => {
    return listMaintenanceRequestsFn();
  },
  head: () => ({ meta: [{ title: "Maintenance · AssetFlow" }] }),
});

const stages = ["PENDING", "APPROVED", "TECHNICIAN_ASSIGNED", "IN_PROGRESS", "RESOLVED"];
const stageLabels: Record<string, string> = {
  "PENDING": "Pending",
  "APPROVED": "Approved",
  "TECHNICIAN_ASSIGNED": "Technician Assigned",
  "IN_PROGRESS": "In Progress",
  "RESOLVED": "Resolved"
};

function Maintenance() {
  const items = Route.useLoaderData();
  const router = useRouter();
  const updateStage = useServerFn(updateMaintenanceStageFn);
  const { can } = useAuth();

  const advance = async (id: string, currentStage: string) => {
    const idx = stages.indexOf(currentStage);
    if (idx === stages.length - 1) return; // Already resolved
    
    const next = stages[idx + 1];
    try {
      await updateStage({ data: { id, stage: next } });
      toast.success(`Moved to ${stageLabels[next]}`);
      router.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to update stage");
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold">Maintenance Management</h1>
      <p className="text-sm text-muted-foreground mt-1">Approval workflow — click a card to advance stage</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const list = items.filter((i: any) => i.status === stage);
          return (
            <div key={stage} className="rounded-2xl bg-card border border-border p-3 min-h-[320px]">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1 pb-2 border-b border-border">
                {stageLabels[stage]} <span className="text-foreground">({list.length})</span>
              </div>
              <div className="mt-3 space-y-2">
                {list.map((m: any) => (
                  <Card
                    key={m.id}
                    onClick={() => can('APPROVE_MAINTENANCE') ? advance(m.id, m.status) : null}
                    className={`p-3 bg-background border-border rounded-lg ${can('APPROVE_MAINTENANCE') ? 'hover:border-primary/50 cursor-pointer' : ''}`}
                  >
                    <div className="font-mono text-xs text-primary">{m.asset?.assetTag}</div>
                    <div className="text-sm mt-1 font-medium">{m.asset?.name}</div>
                    <div className="text-sm mt-1 text-muted-foreground">{m.issue}</div>
                    {m.technicianId && <div className="text-xs text-muted-foreground mt-1">tech assigned</div>}
                  </Card>
                ))}
                {list.length === 0 && (
                  <div className="text-xs text-muted-foreground italic px-1 py-4 text-center">Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6 italic">
        Approving a card moves the asset to under maintenance, resolving returns it to available.
      </p>
    </div>
  );
}
