import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { logoutFn } from "../server-functions";
import { Button } from "@/components/ui/button";
import { useAuth } from "../lib/auth-context";
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowLeftRight,
  Calendar,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  FileCode2,
  LogOut,
} from "lucide-react";
import type { Permission } from "../lib/permissions";

const allItems: { title: string, url: string, icon: any, requiredPermission?: Permission }[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Organization setup", url: "/organization", icon: Building2, requiredPermission: 'MANAGE_DEPARTMENTS' },
  { title: "Assets", url: "/assets", icon: Package }, // Scoped inside the page
  { title: "Allocation & Transfer", url: "/allocation", icon: ArrowLeftRight }, // Scoped inside the page
  { title: "Resource Booking", url: "/resources", icon: Calendar },
  { title: "Maintenance", url: "/maintenance", icon: Wrench }, // Scoped inside the page
  { title: "Audit", url: "/audit", icon: ClipboardCheck }, // Scoped inside the page
  { title: "Reports", url: "/reports", icon: BarChart3, requiredPermission: 'VIEW_ALL_REPORTS' },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "API Docs", url: "/api-docs", icon: FileCode2 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { can, user } = useAuth();
  const navigate = useNavigate();
  const logout = useServerFn(logoutFn);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-sidebar border-r border-border z-40">
      <div className="px-6 py-5 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/40 grid place-items-center">
            <span className="text-primary font-bold text-sm">AF</span>
          </div>
          <span className="text-lg font-bold tracking-tight">AssetFlow</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {allItems.map((item) => {
          if (item.requiredPermission && !can(item.requiredPermission)) return null;
          
          const active = pathname.startsWith(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "border border-primary/60 text-primary bg-primary/5"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{user?.name || 'Loading...'}</span>
          <span className="text-xs text-muted-foreground">{user ? user.role.replace('_', ' ') : ''}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
