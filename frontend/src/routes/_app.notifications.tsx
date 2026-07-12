import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { getNotificationsFn } from "../server-functions";

export const Route = createFileRoute("/_app/notifications")({
  component: Notifications,
  loader: async () => {
    return getNotificationsFn();
  },
  head: () => ({ meta: [{ title: "Notifications · AssetFlow" }] }),
});

const tabs = ["All", "Alerts", "Approvals", "Bookings"];

function Notifications() {
  const notifications = Route.useLoaderData();
  const [tab, setTab] = useState("All");
  
  const rows = tab === "All" ? notifications : notifications.filter((n: any) => n.category === tab);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Activity logs & Notifications</h1>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-secondary">
            {tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
          </TabsList>
        </Tabs>

        <div className="mt-4 divide-y divide-border">
          {rows.map((n: any) => (
            <div key={n.id} className="flex items-center gap-3 py-3">
              <Checkbox />
              <div className="flex-1 text-sm">{n.message}</div>
              <div className="text-xs text-muted-foreground">{n.time}</div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No notifications found for this category.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
