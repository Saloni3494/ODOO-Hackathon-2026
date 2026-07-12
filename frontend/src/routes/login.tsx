import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: "AssetFlow – Login" },
      { name: "description", content: "Sign in to AssetFlow enterprise asset management." },
    ],
  }),
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-lg font-semibold">AssetFlow – login</h1>
          <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-primary/40 bg-primary/10 grid place-items-center">
            <span className="text-primary font-bold">AF</span>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="rounded-full bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••••" className="rounded-full bg-background" />
            <div className="text-right">
              <button type="button" className="text-xs text-muted-foreground hover:text-primary">Forgot password</button>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium">New here?</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Sign up creates an employee account<br />admin roles assigned later
            </p>
            <Button type="button" variant="outline" className="mt-3 w-full rounded-full">Create Account</Button>
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
