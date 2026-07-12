import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusPill } from "@/components/StatusPill";
import { Plus, QrCode, Search } from "lucide-react";
import { toast } from "sonner";
import { listAssetsFn, listCategoriesFn, registerAssetFn } from "../server-functions";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/_app/assets")({
  component: Assets,
  loader: async () => {
    const [assets, categories] = await Promise.all([
      listAssetsFn(),
      listCategoriesFn()
    ]);
    return { assets, categories };
  },
  head: () => ({ meta: [{ title: "Assets · AssetFlow" }] }),
});

function Assets() {
  const { assets, categories } = Route.useLoaderData();
  const { can } = useAuth();
  const router = useRouter();
  const registerAsset = useServerFn(registerAssetFn);
  
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");

  const rows = useMemo(
    () =>
      assets.filter((a: any) => {
        const matchQ = !q || `${a.assetTag} ${a.name}`.toLowerCase().includes(q.toLowerCase());
        const matchC = cat === "all" || a.categoryId === cat;
        const matchS = status === "all" || a.lifecycleStatus === status;
        return matchQ && matchC && matchS;
      }),
    [q, cat, status, assets]
  );

  const handleRegister = async () => {
    if (!name || !categoryId) {
      toast.error("Name and Category are required");
      return;
    }
    
    try {
      await registerAsset({ data: { name, categoryId, location } });
      toast.success("Asset registered successfully");
      setOpen(false);
      setName("");
      setLocation("");
      router.invalidate(); // Refresh loader data
    } catch (e: any) {
      toast.error(e.message || "Failed to register asset");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assets</h1>
      </div>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by tag, serial, or QR code..." className="pl-9 rounded-full bg-background" />
          </div>
          {can("REGISTER_ASSET") && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Register Asset</Button></DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Register Asset</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
                  <div><Label>Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Location</Label><Input value={location} onChange={e => setLocation(e.target.value)} className="mt-1" /></div>
                </div>
                <DialogFooter><Button onClick={handleRegister}>Register</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="mt-4 flex gap-3 flex-wrap">
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {["AVAILABLE", "ALLOCATED", "RESERVED", "UNDER_MAINTENANCE", "LOST", "RETIRED", "DISPOSED"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>QR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.assetTag}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.category?.name}</TableCell>
                  <TableCell><StatusPill status={a.lifecycleStatus} /></TableCell>
                  <TableCell>{a.location}</TableCell>
                  <TableCell>
                    {a.qrCodeUrl ? <img src={a.qrCodeUrl} alt="QR" className="h-6 w-6" /> : <QrCode className="h-4 w-4 text-muted-foreground" />}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No assets found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
