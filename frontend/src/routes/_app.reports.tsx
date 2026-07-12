import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { maintenanceFrequency, utilizationByDept } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports & Analytics · AssetFlow" }] }),
});

function Reports() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Utilization by department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={utilizationByDept}>
              <CartesianGrid stroke="#323232" strokeDasharray="3 3" />
              <XAxis dataKey="dept" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #323232" }} />
              <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Maintenance Frequency</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={maintenanceFrequency}>
              <CartesianGrid stroke="#323232" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #323232" }} />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Most used assets</h3>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <div>Room B2: 39 bookings this month</div>
            <div>Van AF-343: 21 trips this month</div>
            <div>Projector AF-335: 18 uses</div>
          </div>
        </Card>
        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Idle assets</h3>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <div>Camera AF-0301 – unused 60+ days</div>
            <div>Chair AF-0410 – unused 45 days</div>
          </div>
        </Card>
      </div>

      <Card className="mt-4 bg-card border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold">Assets due for maintenance / nearing retirement</h3>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <div>Forklift AF-0087 – service due in 5 days</div>
          <div>Laptop AF-0020 – 4 years old – nearing retirement</div>
        </div>
      </Card>

      <Button className="mt-6" variant="destructive" onClick={() => toast.success("Report exported")}>Export report</Button>
    </div>
  );
}
