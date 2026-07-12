import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { maintenance, type MaintenanceItem } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/maintenance")({
  component: Maintenance,
  head: () => ({ meta: [{ title: "Maintenance · AssetFlow" }] }),
});

const stages: MaintenanceItem["stage"][] = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];

function Maintenance() {
  const [items, setItems] = useState(maintenance);

  const advance = (id: string) => {
    setItems((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const idx = stages.indexOf(m.stage);
        const next = stages[Math.min(idx + 1, stages.length - 1)];
        toast.success(`Moved to ${next}`);
        return { ...m, stage: next };
      })
    );
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold">Maintenance Management</h1>
      <p className="text-sm text-muted-foreground mt-1">Approval workflow — click a card to advance stage</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const list = items.filter((i) => i.stage === stage);
          return (
            <div key={stage} className="rounded-2xl bg-card border border-border p-3 min-h-[320px]">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1 pb-2 border-b border-border">
                {stage} <span className="text-foreground">({list.length})</span>
              </div>
              <div className="mt-3 space-y-2">
                {list.map((m) => (
                  <Card
                    key={m.id}
                    onClick={() => advance(m.id)}
                    className="p-3 bg-background border-border hover:border-primary/50 cursor-pointer rounded-lg"
                  >
                    <div className="font-mono text-xs text-primary">{m.tag}</div>
                    <div className="text-sm mt-1">{m.issue}</div>
                    {m.technician && <div className="text-xs text-muted-foreground mt-1">tech: {m.technician}</div>}
                  </Card>
                ))}
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
