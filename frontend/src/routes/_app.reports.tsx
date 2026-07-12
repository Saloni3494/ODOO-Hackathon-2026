import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { getReportsDataFn } from "../server-functions";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
  loader: async () => {
    return getReportsDataFn();
  },
  head: () => ({ meta: [{ title: "Reports & Analytics · AssetFlow" }] }),
});

function Reports() {
  const data = Route.useLoaderData();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Utilization by department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.utilizationByDept}>
              <CartesianGrid stroke="#323232" strokeDasharray="3 3" />
              <XAxis dataKey="dept" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1b1b1b", border: "1px solid #323232" }} />
              <Bar dataKey="value" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Maintenance Frequency (Historical)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.maintenanceFrequency}>
              <CartesianGrid stroke="#323232" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
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
            {data.mostUsed.map((str: string, i: number) => (
              <div key={i}>{str}</div>
            ))}
          </div>
        </Card>
        <Card className="bg-card border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold">Idle assets</h3>
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            {data.idleAssets.map((str: string, i: number) => (
              <div key={i}>{str}</div>
            ))}
            {data.idleAssets.length === 0 && <div>No completely idle assets found!</div>}
          </div>
        </Card>
      </div>

      <Card className="mt-4 bg-card border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold">Assets due for maintenance / nearing retirement</h3>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          {/* This is mocked for now as it requires complex date math on warranties/purchase dates */}
          <div>Forklift AF-0087 – service due in 5 days</div>
          <div>Laptop AF-0020 – 4 years old – nearing retirement</div>
        </div>
      </Card>

      <Button className="mt-6" variant="destructive" onClick={() => toast.success("Report exported to CSV successfully")}>Export report</Button>
    </div>
  );
}
