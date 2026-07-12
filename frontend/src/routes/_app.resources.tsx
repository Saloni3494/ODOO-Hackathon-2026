import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/resources")({
  component: Resources,
  head: () => ({ meta: [{ title: "Resource Booking · AssetFlow" }] }),
});

const hours = ["9:00", "10:00", "11:00", "12:00", "1:00"];

function Resources() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Resource Booking</h1>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6 space-y-4">
        <div>
          <Input defaultValue="Conference room B2 – Tue, 7 Jul" className="bg-background" />
        </div>

        <div className="mt-4 rounded-xl border border-border p-4 bg-background/40">
          {hours.map((h, i) => (
            <div key={h} className="grid grid-cols-[60px_1fr] items-center gap-4 py-2 border-b border-border/40 last:border-0 min-h-14">
              <div className="text-xs text-muted-foreground font-mono">{h}</div>
              <div className="relative h-8">
                {i === 0 && (
                  <div className="absolute inset-y-0 left-0 right-4 rounded-md bg-primary/25 border-2 border-dashed border-primary text-primary px-3 flex items-center text-xs font-medium">
                    Booked – Procurement Team – 9 to 10
                  </div>
                )}
                {i === 1 && (
                  <div className="absolute inset-y-0 left-8 right-24 rounded-md bg-destructive/15 border-2 border-dashed border-destructive text-destructive px-3 flex items-center text-xs font-medium">
                    Requested 9:30 to 10:30 – conflict – slot is unavailable
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => toast.success("Slot booked")}>Book a slot</Button>
      </Card>
    </div>
  );
}
