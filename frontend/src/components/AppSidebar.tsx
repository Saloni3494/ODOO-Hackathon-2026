import { Link, useRouterState } from "@tanstack/react-router";
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
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Organization setup", url: "/organization", icon: Building2 },
  { title: "Assets", url: "/assets", icon: Package },
  { title: "Allocation & Transfer", url: "/allocation", icon: ArrowLeftRight },
  { title: "Resource Booking", url: "/resources", icon: Calendar },
  { title: "Maintenance", url: "/maintenance", icon: Wrench },
  { title: "Audit", url: "/audit", icon: ClipboardCheck },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "API Docs", url: "/api-docs", icon: FileCode2 },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

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
        {items.map((item) => {
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
      <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
        v1.0 · Admin console
      </div>
    </aside>
  );
}
