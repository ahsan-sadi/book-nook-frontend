import Link from "next/link";

export default function Logo({ className = "" }) {
    return (<Link href="/" className={`flex items-center gap-2 text-2xl text-primary ${className}`} style={{ fontFamily: "var(--font-display)" }}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="5" width="6" height="22" rx="1" fill="currentColor"/>
        <rect x="12" y="5" width="6" height="22" rx="1" fill="currentColor" opacity=".7"/>
        <rect x="20.5" y="7" width="6" height="20" rx="1" transform="rotate(12 23 17)" fill="var(--secondary)"/>
      </svg>
      BookNook
    </Link>);
}
