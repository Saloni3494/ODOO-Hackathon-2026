import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus, Calendar, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard · AssetFlow" }] }),
});

const stats = [
  { label: "Available", value: 128 },
  { label: "Allocated", value: 76 },
  { label: "Maintenance Today", value: 4 },
  { label: "Active Bookings", value: 9 },
  { label: "Pending Transfers", value: 3 },
  { label: "Upcoming returns", value: 12 },
];

const activity = [
  "Laptop AF-0114 – allocated to Priya shah – IT dept",
  "Room B2 – booking confirmed – 2:00 to 3:00 PM",
  "Projector AF-0062 – maintenance resolved",
];

function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Today's Overview</h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 bg-card border-border rounded-2xl">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <p className="text-sm">3 assets overdue for return – flagged for follow-up</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild><Link to="/assets"><Plus className="h-4 w-4 mr-1" /> Register asset</Link></Button>
        <Button asChild variant="outline"><Link to="/resources"><Calendar className="h-4 w-4 mr-1" /> Book resource</Link></Button>
        <Button asChild variant="outline"><Link to="/maintenance"><FileText className="h-4 w-4 mr-1" /> Raise request</Link></Button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {activity.map((a) => (
            <div key={a} className="border-b border-border/60 pb-2">{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
