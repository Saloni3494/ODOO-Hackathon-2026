import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { loginFn, signupFn } from "../server-functions";

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
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  
  const login = useServerFn(loginFn);
  const signup = useServerFn(signupFn);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw || (isSignup && !name)) {
      toast.error("Fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      if (isSignup) {
        await signup({ data: { name, email, password: pw } });
        toast.success("Account created successfully!");
      } else {
        await login({ data: { email, password: pw } });
        toast.success("Welcome back!");
      }
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-lg font-semibold">{isSignup ? "AssetFlow – Sign up" : "AssetFlow – Login"}</h1>
          <div className="mx-auto mt-4 h-16 w-16 rounded-full border border-primary/40 bg-primary/10 grid place-items-center">
            <span className="text-primary font-bold">AF</span>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {isSignup && (
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="rounded-full bg-background" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="rounded-full bg-background" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••••" className="rounded-full bg-background" />
            {!isSignup && (
              <div className="text-right">
                <button 
                  type="button" 
                  className="text-xs text-muted-foreground hover:text-primary"
                  onClick={() => toast.info("Password resets are handled by IT. Please contact support@assetflow.com")}
                >
                  Forgot password
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium">{isSignup ? "Already have an account?" : "New here?"}</p>
            {!isSignup && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Sign up creates an employee account<br />admin roles assigned later
              </p>
            )}
            <Button 
              type="button" 
              variant="outline" 
              className="mt-3 w-full rounded-full"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Back to Login" : "Create Account"}
            </Button>
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? (isSignup ? "Creating..." : "Signing in...") : (isSignup ? "Sign up" : "Sign in")}
          </Button>
        </form>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
