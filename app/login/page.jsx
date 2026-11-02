import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import Spinner from "@/components/Spinner";
export const metadata = { title: "Login" };
export default function LoginPage() { return <Suspense fallback={<Spinner />}><LoginForm /></Suspense>; }
