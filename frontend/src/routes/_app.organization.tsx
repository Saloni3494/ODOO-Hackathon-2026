import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { departments, categories, employees } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/organization")({
  component: Organization,
  head: () => ({ meta: [{ title: "Organization setup · AssetFlow" }] }),
});

function Organization() {
  const [tab, setTab] = useState("departments");
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organization setup</h1>
      </div>

      <Card className="mt-6 bg-card border-border rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle>Add {tab.slice(0, -1)}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input className="mt-1" /></div>
                <div><Label>Details</Label><Input className="mt-1" /></div>
              </div>
              <DialogFooter>
                <Button onClick={() => { toast.success("Added"); setOpen(false); }}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsContent value="departments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>Parent Dept</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.head}</TableCell>
                    <TableCell>{d.parent}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${d.status === "Active" ? "bg-primary/15 text-primary border-primary/30" : "bg-muted-foreground/15 text-muted-foreground border-border"}`}>{d.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-4 italic">Editing a department here also drives the picklist in Screen 4 & 5</p>
          </TabsContent>

          <TabsContent value="categories">
            <Table>
              <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Assets</TableHead></TableRow></TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c}><TableCell>{c}</TableCell><TableCell>{Math.floor(Math.random() * 80 + 5)}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="employees">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
              <TableBody>
                {employees.map((e) => (
                  <TableRow key={e.id}><TableCell>{e.name}</TableCell><TableCell>{e.email}</TableCell><TableCell>{e.department}</TableCell><TableCell>{e.role}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
