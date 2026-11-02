import { Spinner as SpinnerIcon } from "@/components/ui/spinner";

export default function Spinner({ label = "Loading" }) {
    return (<div className="flex min-h-[50vh] flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <SpinnerIcon className="size-7 text-primary" />
      <span className="text-sm text-muted-foreground">{label}…</span>
    </div>);
}
