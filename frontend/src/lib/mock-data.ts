export type AssetStatus =
  | "Available"
  | "Allocated"
  | "Reserved"
  | "Under Maintenance"
  | "Lost"
  | "Retired"
  | "Disposed";

export interface Department {
  id: string;
  name: string;
  head: string;
  parent: string;
  status: "Active" | "Inactive";
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Admin" | "Manager" | "Employee";
}

export interface Asset {
  tag: string;
  name: string;
  category: string;
  status: AssetStatus;
  location: string;
}

export interface Booking {
  id: string;
  resource: string;
  team: string;
  date: string;
  start: string;
  end: string;
  status: "Booked" | "Requested" | "Conflict";
}

export interface MaintenanceItem {
  id: string;
  tag: string;
  issue: string;
  technician?: string;
  stage: "Pending" | "Approved" | "Technician Assigned" | "In Progress" | "Resolved";
}

export interface AuditRow {
  asset: string;
  reportedLocation: string;
  verification: "Verified" | "Missing" | "Damaged";
}

export interface Notification {
  id: string;
  message: string;
  category: "Alerts" | "Approvals" | "Bookings" | "Activity";
  time: string;
}

export const departments: Department[] = [
  { id: "d1", name: "Engineering", head: "aditi rao", parent: "—", status: "Active" },
  { id: "d2", name: "Facilities", head: "rohan mehta", parent: "—", status: "Active" },
  { id: "d3", name: "Field ops (east)", head: "sana iqbal", parent: "Field Ops", status: "Inactive" },
  { id: "d4", name: "Procurement", head: "vikram singh", parent: "—", status: "Active" },
];

export const categories = ["Electronics", "Furniture", "Vehicles", "Tools", "IT Equipment"];

export const employees: Employee[] = [
  { id: "e1", name: "Priya Shah", email: "priya@company.com", department: "Engineering", role: "Employee" },
  { id: "e2", name: "Arjun Nair", email: "arjun@company.com", department: "Engineering", role: "Manager" },
  { id: "e3", name: "Sana Iqbal", email: "sana@company.com", department: "Field ops (east)", role: "Manager" },
  { id: "e4", name: "R Varma", email: "rvarma@company.com", department: "Facilities", role: "Employee" },
  { id: "e5", name: "A Rao", email: "arao@company.com", department: "Engineering", role: "Admin" },
];

export const assets: Asset[] = [
  { tag: "AF-0012", name: "Dell Laptop", category: "Electronics", status: "Allocated", location: "bengaluru" },
  { tag: "AF-0062", name: "Projector", category: "Electronics", status: "Under Maintenance", location: "HQ floor 2" },
  { tag: "AF-0201", name: "Office chair", category: "Furniture", status: "Available", location: "Warehouse" },
  { tag: "AF-0114", name: "Dell Laptop", category: "Electronics", status: "Allocated", location: "IT dept" },
  { tag: "AF-0033", name: "Forklift", category: "Vehicles", status: "Under Maintenance", location: "Warehouse" },
  { tag: "AF-0301", name: "Camera", category: "Electronics", status: "Available", location: "Studio" },
  { tag: "AF-0410", name: "Chair", category: "Furniture", status: "Available", location: "HQ floor 1" },
  { tag: "AF-0087", name: "Forklift", category: "Vehicles", status: "Reserved", location: "Warehouse" },
  { tag: "AF-0020", name: "Laptop", category: "Electronics", status: "Retired", location: "HQ" },
  { tag: "AF-0055", name: "Printer", category: "Electronics", status: "Under Maintenance", location: "HQ floor 3" },
];

export const bookings: Booking[] = [
  { id: "b1", resource: "Conference room B2", team: "Procurement Team", date: "Tue, 7 Jul", start: "09:00", end: "10:00", status: "Booked" },
  { id: "b2", resource: "Conference room B2", team: "Design", date: "Tue, 7 Jul", start: "09:30", end: "10:30", status: "Conflict" },
];

export const maintenance: MaintenanceItem[] = [
  { id: "m1", tag: "AF-0062", issue: "Projector bulb not turning on", stage: "Pending" },
  { id: "m2", tag: "AF-003", issue: "ac unit noisy compressor", stage: "Approved" },
  { id: "m3", tag: "AF-0078", issue: "forklift", technician: "R varma", stage: "Technician Assigned" },
  { id: "m4", tag: "AF-847", issue: "Printer jam parts ordered", stage: "In Progress" },
  { id: "m5", tag: "AF-873", issue: "Chair repair resolved 7 Jul", stage: "Resolved" },
];

export const auditRows: AuditRow[] = [
  { asset: "AF-003 Dell laptop", reportedLocation: "Desk #12", verification: "Verified" },
  { asset: "AF-0421 Office chair", reportedLocation: "Desk #14", verification: "Missing" },
  { asset: "AF-0838 Monitor", reportedLocation: "Desk E15", verification: "Damaged" },
];

export const notifications: Notification[] = [
  { id: "n1", message: "Laptop AF-0014 assigned to Priya shah", category: "Activity", time: "2m ago" },
  { id: "n2", message: "Maintenance request AF-0055 approved", category: "Approvals", time: "18m ago" },
  { id: "n3", message: "Booking confirmed : Room B2 : 2:00 to 3:00 PM", category: "Bookings", time: "1h ago" },
  { id: "n4", message: "Transfer approved: AF-0033 to facilities dept", category: "Approvals", time: "3h ago" },
  { id: "n5", message: "Overdue return: AF-0021 was due 3 days ago", category: "Alerts", time: "1d ago" },
  { id: "n6", message: "Audit discrepancy flagged: AF-0088 damaged", category: "Alerts", time: "2d ago" },
];

export const utilizationByDept = [
  { dept: "Eng", value: 82 },
  { dept: "Fac", value: 64 },
  { dept: "Ops", value: 71 },
  { dept: "Fin", value: 40 },
  { dept: "HR", value: 55 },
  { dept: "IT", value: 90 },
];

export const maintenanceFrequency = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 14 },
  { month: "Apr", value: 22 },
  { month: "May", value: 28 },
  { month: "Jun", value: 24 },
  { month: "Jul", value: 32 },
];

export const statusColor: Record<AssetStatus, string> = {
  Available: "bg-primary/15 text-primary border-primary/30",
  Allocated: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Reserved: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Under Maintenance": "bg-warning/15 text-warning border-warning/30",
  Lost: "bg-destructive/15 text-destructive border-destructive/30",
  Retired: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
  Disposed: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30",
};
