import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { listBookableAssetsFn, getAssetBookingsFn, bookResourceFn, listUsersFn } from "../server-functions";

export const Route = createFileRoute("/_app/resources")({
  component: Resources,
  loader: async () => {
    const [bookableAssets, users] = await Promise.all([
      listBookableAssetsFn(),
      listUsersFn()
    ]);
    return { bookableAssets, users };
  },
  head: () => ({ meta: [{ title: "Resource Booking · AssetFlow" }] }),
});

function Resources() {
  const { bookableAssets, users } = Route.useLoaderData();
  const router = useRouter();
  
  const getAssetBookings = useServerFn(getAssetBookingsFn);
  const bookResource = useServerFn(bookResourceFn);

  const [assetId, setAssetId] = useState("");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [bookings, setBookings] = useState<any[]>([]);

  const loadBookings = async (selectedAssetId: string) => {
    setAssetId(selectedAssetId);
    if (!selectedAssetId) return;
    try {
      const result = await getAssetBookings({ data: { assetId: selectedAssetId } });
      setBookings(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBook = async () => {
    if (!assetId || !userId || !date || !startTime || !endTime) {
      return toast.error("Please fill all fields");
    }

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    if (start >= end) {
      return toast.error("End time must be after start time");
    }

    try {
      await bookResource({ data: { assetId, userId, startTime: start.toISOString(), endTime: end.toISOString() } });
      toast.success("Resource booked successfully");
      loadBookings(assetId);
    } catch (e: any) {
      toast.error(e.message || "Failed to book resource. Slot might be taken.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Resource Booking</h1>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Select Resource (Rooms / Shared Assets)</Label>
            <Select value={assetId} onValueChange={loadBookings}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {bookableAssets.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>{a.name} ({a.assetTag})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Book For (User)</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select User..." /></SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
             <Label>Date</Label>
             <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
             <Label>Start Time</Label>
             <input type="time" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
             <Label>End Time</Label>
             <input type="time" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        {assetId && (
          <div className="mt-4">
            <h3 className="font-semibold mb-3">Current Bookings for this Resource</h3>
            <div className="rounded-xl border border-border p-4 bg-background/40 max-h-[300px] overflow-y-auto">
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No current bookings. The schedule is clear!</p>
              ) : (
                bookings.map((b, i) => (
                  <div key={b.id} className="grid grid-cols-[120px_1fr] items-center gap-4 py-3 border-b border-border/40 last:border-0">
                    <div className="text-xs text-muted-foreground font-mono">
                      {new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                      {new Date(b.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="relative h-8">
                      <div className="absolute inset-y-0 left-0 right-4 rounded-md bg-primary/10 border border-primary/40 text-primary px-3 flex items-center text-xs font-medium">
                        Booked by: {b.user?.name} ({b.status})
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <Button onClick={handleBook} disabled={!assetId}>Book Slot</Button>
      </Card>
    </div>
  );
}
