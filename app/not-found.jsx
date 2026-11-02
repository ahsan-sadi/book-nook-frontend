import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Page not found" };
export default function NotFound() {
    return (<div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <p className="eyebrow">Lost in the stacks</p>
      <p className="display text-gradient text-7xl md:text-8xl">404</p>
      <h1 className="display text-2xl md:text-3xl">This page isn't on our shelves</h1>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">The link may be broken, or the page has moved. The reading room is just one page away.</p>
      <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-2 rounded-full px-5")}>Back to Home</Link>
    </div>);
}
