import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="md:pl-60">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
