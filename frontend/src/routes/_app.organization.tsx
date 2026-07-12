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
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrganizationDataFn, updateEmployeeFn } from "../server-functions";

export const Route = createFileRoute("/_app/organization")({
  component: Organization,
  loader: async () => {
    return getOrganizationDataFn();
  },
  head: () => ({ meta: [{ title: "Organization setup · AssetFlow" }] }),
});

function Organization() {
  const { departments, categories, employees, roles } = Route.useLoaderData();
  const router = useRouter();
  const updateEmployee = useServerFn(updateEmployeeFn);
  
  const [tab, setTab] = useState("departments");
  const [open, setOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Edit User State
  const [editRoleId, setEditRoleId] = useState("");
  const [editDeptId, setEditDeptId] = useState("");

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditRoleId(user.roleId || "");
    setEditDeptId(user.departmentId || "");
    setEditUserOpen(true);
  };

  const submitEditUser = async () => {
    if (!selectedUser) return;
    try {
      await updateEmployee({
        data: {
          userId: selectedUser.id,
          roleId: editRoleId,
          departmentId: editDeptId || null
        }
      });
      toast.success("Employee updated successfully");
      setEditUserOpen(false);
      router.invalidate();
    } catch (e: any) {
      toast.error(e.message || "Failed to update employee");
    }
  };

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
                  <TableHead>Head / Manager</TableHead>
                  <TableHead>Parent Dept</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d: any) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell>{d.manager?.name || "Unassigned"}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs bg-primary/15 text-primary border-primary/30">Active</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-4 italic">Editing a department here also drives the picklist in Screen 4 & 5</p>
          </TabsContent>

          <TabsContent value="categories">
            <Table>
              <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Total Assets</TableHead></TableRow></TableHeader>
              <TableBody>
                {categories.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c._count.assets}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="employees">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {employees.map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell>{e.department?.name || "Unassigned"}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full border px-2.5 py-0.5 text-xs bg-muted text-muted-foreground border-border">{e.role?.name}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(e)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Edit User Dialog */}
            <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
                {selectedUser && (
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Employee Name</Label>
                      <Input value={selectedUser.name} disabled className="mt-1 bg-muted" />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Select value={editRoleId} onValueChange={setEditRoleId}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select Role" /></SelectTrigger>
                        <SelectContent>
                          {roles?.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select value={editDeptId} onValueChange={setEditDeptId}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="No Department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Department</SelectItem>
                          {departments?.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={submitEditUser}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
