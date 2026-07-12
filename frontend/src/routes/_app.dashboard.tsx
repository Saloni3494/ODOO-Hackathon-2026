import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus, Calendar, FileText } from "lucide-react";
import { getDashboardStatsFn } from "../server-functions";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  loader: async () => {
    return getDashboardStatsFn();
  },
  head: () => ({ meta: [{ title: "Dashboard · AssetFlow" }] }),
});

function Dashboard() {
  const { available, allocated, maintenance, activeBookings } = Route.useLoaderData();

  const stats = [
    { label: "Available", value: available },
    { label: "Allocated", value: allocated },
    { label: "Maintenance Today", value: maintenance },
    { label: "Active Bookings", value: activeBookings },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Today's Overview</h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 bg-card border-border rounded-2xl">
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <p className="text-sm">Check upcoming overdue returns in the notifications panel.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild><Link to="/assets"><Plus className="h-4 w-4 mr-1" /> Register asset</Link></Button>
        <Button asChild variant="outline"><Link to="/resources"><Calendar className="h-4 w-4 mr-1" /> Book resource</Link></Button>
        <Button asChild variant="outline"><Link to="/maintenance"><FileText className="h-4 w-4 mr-1" /> Raise request</Link></Button>
      </div>
    </div>
  );
}
