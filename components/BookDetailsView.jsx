"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, BookOpen, CalendarDays, UserRound } from "lucide-react";
import Spinner from "./Spinner";
import CoverImage from "./CoverImage";
import { shelfApi } from "@/lib/shelf-api";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner as SpinnerIcon } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function BookDetailsView({ id }) {
    const { data: session, isPending: sessionPending } = useSession();
    const [book, setBook] = useState(null);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        shelfApi(`/addbooks/${id}`).then(setBook).catch((e) => setError(e.message));
    }, [id]);

    if (error)
        return (
            <div className="container-page py-20 text-center">
                <p className="text-destructive">{error}</p>
                <Link href="/books" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
                    <ArrowLeft size={16}/>Back to all books
                </Link>
            </div>
        );
    if (!book)
        return <Spinner label="Loading book"/>;

    const soldOut = book.availableCopies <= 0;
    const borrow = async () => {
        setBusy(true);
        try {
            await shelfApi("/borrows", {
                method: "POST",
                body: { bookId: book._id, userEmail: session.user.email, userName: session.user.name },
            });
            toast.success("Borrowed! It's due back in 7 days.");
            setBook({ ...book, availableCopies: book.availableCopies - 1 });
            setOpen(false);
        }
        catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not borrow this book.");
        }
        finally {
            setBusy(false);
        }
    };

    return (
        <div className="container-page py-10 md:py-14">
            <Link href="/books" className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-all hover:-translate-x-1 hover:text-secondary">
                <ArrowLeft size={16}/>All books
            </Link>

            <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-14 lg:gap-20">
                {/* Cover with offset frame */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-sm md:max-w-none">
                    <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border-2 border-secondary/60"/>
                    <div className="lift relative overflow-hidden rounded-2xl border border-border bg-muted">
                        <CoverImage src={book.image} alt={`Cover of ${book.title}`} width={480} height={640} className="book-cover"/>
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
                    <Badge className="rounded-full px-3 text-[0.7rem] font-semibold tracking-wide uppercase">{book.category}</Badge>
                    <h1 className="display text-3xl md:text-5xl">{book.title}</h1>
                    <p className="display text-lg italic text-muted-foreground">by {book.author}</p>

                    <div className="flex flex-wrap gap-6 border-y border-border py-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2"><UserRound size={15} className="text-secondary"/>{book.addedByName}</span>
                        <span className="flex items-center gap-2"><CalendarDays size={15} className="text-secondary"/>Added {formatDate(book.createdAt)}</span>
                        <span className="flex items-center gap-2"><BookOpen size={15} className="text-secondary"/>{book.availableCopies} of {book.totalCopies} copies available</span>
                    </div>

                    <p className="max-w-prose leading-relaxed text-foreground/85">{book.description}</p>

                    {/* Availability meter */}
                    <div className="max-w-md space-y-2">
                        <div className="flex justify-between text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            <span>Availability</span>
                            <span className="tabular-nums">{book.availableCopies}/{book.totalCopies}</span>
                        </div>
                        <Progress
                            value={book.totalCopies ? (book.availableCopies / book.totalCopies) * 100 : 0}
                            max={100}
                            aria-label="Copies available"
                            className={soldOut ? "[&_[data-slot=progress-indicator]]:bg-destructive" : ""}
                        />
                    </div>

                    <div className="pt-2">
                        {sessionPending ? (
                            <div className="h-11 w-44 rounded-xl skeleton-paper" aria-hidden="true"/>
                        ) : session ? (
                            <Button variant="secondary" size="xl" className="px-8" disabled={soldOut} onClick={() => setOpen(true)}>
                                {soldOut ? "All copies are out" : "Borrow This Book"}
                            </Button>
                        ) : (
                            <Link href={`/login?redirect=/books/${book._id}`} className={buttonVariants({ variant: "secondary", size: "xl" })}>
                                Sign in to borrow
                            </Link>
                        )}
                        {!soldOut && <p className="mt-3 text-xs text-muted-foreground">7-day loan · no fees · return anytime from My Borrows</p>}
                    </div>
                </motion.div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <span className="eyebrow">Confirm your loan</span>
                        <DialogTitle className="display mt-1 text-xl">Borrow “{book.title}”</DialogTitle>
                        <DialogDescription>Seven days on your reader card — no fees, return anytime.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="borrow-name">Name</Label>
                            <Input id="borrow-name" readOnly value={session?.user?.name || ""} className="h-10 opacity-70"/>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="borrow-email">Email</Label>
                            <Input id="borrow-email" readOnly value={session?.user?.email || ""} className="h-10 opacity-70"/>
                        </div>
                        <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                            Due back in 7 days. You can return it earlier from <strong className="text-foreground">My Borrows</strong>.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
                        <Button onClick={borrow} disabled={busy}>{busy && <SpinnerIcon />}Confirm Borrow</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
