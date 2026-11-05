"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import AuthShell from "./AuthShell";
import { signIn } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner as SpinnerIcon } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const handle = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    let user = Object.fromEntries(f.entries());

    const { data, err } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });
    if (data) {
      redirect("/");
    }
    if (err) {
      console.log(err);
    }

    setBusy(true);
    setError("");
    if (error) {
      setError(error.message || "Email or password is incorrect.");
      toast.error("Couldn't sign you in.");
      return;
    }
    toast.success("Welcome back!");
    router.push(redirect);
    router.refresh();
  };
  const google = () =>
    signIn.social({ provider: "google", callbackURL: redirect });
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to borrow books, track your loans, and manage your shelf."
    >
      <form onSubmit={handle} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="h-10"
          />
        </div>
        {/* Forgot password is intentionally a placeholder (email reset is out of scope) */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0"
            onClick={() => toast("Password reset is coming soon.")}
          >
            Forgot password?
          </Button>
        </div>
        {error && (
          <Alert
            variant="destructive"
            className="border-destructive/30 bg-destructive/10"
          >
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" size="xl" disabled={busy} className="w-full">
          {busy && <SpinnerIcon />}Login
        </Button>
      </form>
      <div className="my-7 flex items-center gap-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button variant="outline" size="xl" className="w-full" onClick={google}>
        <FcGoogle size={20} />
        Continue with Google
      </Button>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to the reading room?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
