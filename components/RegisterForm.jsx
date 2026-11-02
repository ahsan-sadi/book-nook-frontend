"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import AuthShell from "./AuthShell";
import { signIn, signUp } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner as SpinnerIcon } from "@/components/ui/spinner";

function validatePassword(p) {
    if (p.length < 6)
        return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(p))
        return "Password must include an uppercase letter.";
    if (!/[a-z]/.test(p))
        return "Password must include a lowercase letter.";
    return "";
}

export default function RegisterForm() {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const handle = async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const problem = validatePassword(String(f.get("password")));
        if (problem) {
            setError(problem);
            toast.error(problem);
            return;
        }
        setBusy(true);
        setError("");
        const { error } = await signUp.email({
            name: String(f.get("name")), email: String(f.get("email")), password: String(f.get("password")), image: String(f.get("photo")),
        });
        setBusy(false);
        if (error) {
            setError(error.message || "Could not create your account.");
            toast.error(error.message || "Registration failed.");
            return;
        }
        toast.success("Account created. Log in to continue.");
        router.push("/login");
    };
    return (
        <AuthShell title="Start your shelf" subtitle="One minute to set up — then add books, borrow for a week, and track everything you share.">
            <form onSubmit={handle} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="register-name">Name</Label>
                    <Input id="register-name" name="name" required placeholder="Ada Lovelace" className="h-10"/>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" name="email" type="email" required placeholder="you@example.com" className="h-10"/>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="register-photo">Photo URL</Label>
                    <Input id="register-photo" name="photo" type="url" required placeholder="https://" className="h-10"/>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="register-password">Password</Label>
                    <Input id="register-password" name="password" type="password" required placeholder="••••••••" className="h-10"/>
                    <p className="text-xs text-muted-foreground">At least 6 characters, with one uppercase and one lowercase letter.</p>
                </div>
                {error && (
                    <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                        <AlertDescription className="text-destructive">{error}</AlertDescription>
                    </Alert>
                )}
                <Button type="submit" size="xl" disabled={busy} className="w-full">
                    {busy && <SpinnerIcon />}Register
                </Button>
            </form>
            <div className="my-7 flex items-center gap-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                <span className="h-px flex-1 bg-border"/>
                or
                <span className="h-px flex-1 bg-border"/>
            </div>
            <Button variant="outline" size="xl" className="w-full" onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}>
                <FcGoogle size={20}/>Continue with Google
            </Button>
            <p className="mt-8 text-center text-sm text-muted-foreground">
                Already registered? <Link href="/login" className="font-semibold text-primary hover:underline">Login</Link>
            </p>
        </AuthShell>
    );
}
