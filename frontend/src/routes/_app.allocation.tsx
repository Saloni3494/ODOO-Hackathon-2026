import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { listAssetsFn, listUsersFn, requestTransferFn, returnAssetFn, allocateAssetFn } from "../server-functions";
import { useAuth } from "../lib/auth-context";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/allocation")({
  component: Allocation,
  loader: async () => {
    const [assets, users] = await Promise.all([listAssetsFn(), listUsersFn()]);
    return { assets, users };
  },
  head: () => ({ meta: [{ title: "Allocation & Transfer · AssetFlow" }] }),
});

function Allocation() {
  const { assets, users } = Route.useLoaderData();
  const { can } = useAuth();
  const router = useRouter();
  
  const requestTransfer = useServerFn(requestTransferFn);
  const returnAsset = useServerFn(returnAssetFn);
  const allocateAsset = useServerFn(allocateAssetFn);

  const [assetId, setAssetId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [reason, setReason] = useState("");
  
  const asset = assets.find((a: any) => a.id === assetId);
  const isAllocated = asset?.lifecycleStatus === "ALLOCATED";

  const submitTransfer = async () => {
    if (!assetId || !toUserId || !reason) return toast.error("Fill all fields");
    
    try {
      if (isAllocated) {
        // Assume fromUser is the current holder. For demo, we just pass a placeholder or the actual holder id if we have it
        await requestTransfer({ data: { assetId, fromUserId: users[0]?.id, toUserId, reason } });
        toast.success("Transfer request submitted");
      } else {
        await allocateAsset({ data: { assetId, userId: toUserId } });
        toast.success("Asset allocated successfully");
      }
      setReason("");
      setToUserId("");
      router.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Operation failed");
    }
  };

  const handleReturn = async () => {
    if (!assetId) return;
    try {
      await returnAsset({ data: { assetId, conditionNotes: reason } });
      toast.success("Asset returned successfully");
      setReason("");
      router.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to return asset");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Allocation & Transfer</h1>
        {can('ALLOCATE_ASSET') && (
          <Button variant="outline"><ArrowLeftRight className="mr-2 h-4 w-4" /> Bulk Transfer</Button>
        )}
      </div>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6 space-y-4">
        <div>
          <Label>Select Asset</Label>
          <Select value={assetId} onValueChange={setAssetId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select an asset..." /></SelectTrigger>
            <SelectContent>
              {assets.map((a: any) => (
                <SelectItem key={a.id} value={a.id}>{a.assetTag} – {a.name} ({a.lifecycleStatus})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAllocated && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Asset is Currently Allocated</p>
              <p className="text-muted-foreground mt-1">Direct allocation is blocked. Submitting will create a Transfer Request, or you can Return the asset first.</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold">{isAllocated ? "Transfer Request" : "New Allocation"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {isAllocated && (
               <div>
                 <Label>From</Label>
                 <Input value="Current Holder" disabled className="mt-1" />
               </div>
            )}
            <div>
              <Label>{isAllocated ? "Transfer To" : "Allocate To"}</Label>
              <Select value={toUserId} onValueChange={setToUserId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select Employee..." /></SelectTrigger>
                <SelectContent>
                  {users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label>Reason / Notes</Label>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={5} className="mt-1 bg-background" />
        </div>

        <div className="flex gap-3">
          <Button onClick={submitTransfer}>{isAllocated ? "Submit Transfer Request" : "Allocate Asset"}</Button>
          {isAllocated && (
            <Button variant="outline" onClick={handleReturn}>Return to Inventory</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
