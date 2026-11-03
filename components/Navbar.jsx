"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Moon,
  Sun,
  LogOut,
  UserRound,
  Library,
  BookPlus,
  BookMarked,
} from "lucide-react";
import Logo from "./Logo";
import { signOut, useSession } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];
const privateLinks = [
  { href: "/add-book", label: "Add Book", icon: BookPlus },
  { href: "/my-books", label: "My Books", icon: Library },
  { href: "/my-borrows", label: "My Borrows", icon: BookMarked },
];

export default function Navbar() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
    toast.success("You're signed out.");
    router.refresh();
  };
  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;
  // Active link gets an editorial underline instead of a filled pill
  const linkClass = (href) =>
    `relative px-3 py-2 text-sm font-medium transition-colors hover:text-secondary ${pathname === href ? "text-secondary" : "text-foreground/80"}`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-[0_16px_40px_-32px_rgb(0_0_0/0.45)]" : ""}`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-0 p-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 p-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === l.href ? "bg-secondary/15 text-secondary" : "text-foreground/80 hover:bg-muted"}`}
                    >
                      {l.icon ? <l.icon size={16} /> : null}
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {!user && (
                <div className="flex flex-col gap-2 border-t border-border p-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className={buttonVariants({ variant: "default" })}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
          <Logo />
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l.href)}>
                {l.label}
                {pathname === l.href && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-secondary" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>

          {isPending ? (
            <Skeleton className="ml-1 size-9 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className="ml-1 inline-flex size-9 items-center justify-center rounded-full ring-2 ring-secondary/50 ring-offset-2 ring-offset-background transition hover:ring-secondary"
              >
                <Image
                  src={user.image || "/avatar.svg"}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="size-full rounded-full object-cover"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserRound size={16} />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-books")}>
                  <Library size={16} />
                  My Books
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-borrows")}>
                  <BookMarked size={16} />
                  My Borrows
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
