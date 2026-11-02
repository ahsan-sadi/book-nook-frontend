import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa6";
import { Heart } from "lucide-react";
import Logo from "./Logo";

const socials = [
    { icon: FaXTwitter, href: "https://x.com", label: "X" },
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaGithub, href: "https://github.com", label: "GitHub" },
];
const explore = [
    { href: "/books", label: "All Books" },
    { href: "/add-book", label: "Add a Book" },
    { href: "/my-borrows", label: "My Borrows" },
    { href: "/profile", label: "My Profile" },
];

export default function Footer() {
    return (<footer className="mt-24 border-t border-border bg-muted/50">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="space-y-4 md:col-span-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">A small library you can run from your phone. Add a book, borrow a book, return a book — no card, no late fees.</p>
          <div className="flex gap-2">
            {socials.map((s) => (<a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-secondary hover:text-secondary">
              <s.icon/>
            </a>))}
          </div>
        </div>

        <nav className="md:col-span-3">
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {explore.map((l) => (<li key={l.href}><Link href={l.href} className="text-muted-foreground transition-all hover:translate-x-1 hover:text-secondary">{l.label}</Link></li>))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h3 className="eyebrow">Contact</h3>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="mailto:hello@booknook.app" className="transition-colors hover:text-secondary">hello@booknook.app</a></li>
            <li>+880 1700-000000</li>
            <li className="leading-relaxed">House 12, Road 5,<br/>Dhanmondi, Dhaka</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Made with <Heart size={12} className="text-destructive" fill="currentColor"/> for readers everywhere</p>
        </div>
      </div>
    </footer>);
}
