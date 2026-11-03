"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RotateCcw, TriangleAlert, ArrowRight } from "lucide-react";
import Spinner from "./Spinner";
import CoverImage from "./CoverImage";
import { shelfApi } from "@/lib/shelf-api";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner as SpinnerIcon } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function MyBorrowsView() {
    const { data: session } = useSession();
    const [list, setList] = useState(null);
    const [returning, setReturning] = useState("");

    useEffect(() => {
        if (!session)
            return;
        shelfApi(`/borrows?email=${encodeURIComponent(session.user.email)}`).then(setList).catch((e) => toast.error(e.message));
    }, [session]);

    const giveBack = async (id) => {
        setReturning(id);
        try {
            await shelfApi(`/borrows/${id}`, { method: "DELETE" });
            setList(list.filter((b) => b._id !== id));
            toast.success("Book returned. Thanks!");
        }
        catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not return the book.");
        }
        finally {
            setReturning("");
        }
    };

    if (!list)
        return <Spinner label="Loading your borrows"/>;

    const daysLeft = (due) => Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);

    return (
        <div className="container-page py-12 md:py-16">
            <p className="eyebrow">Your loans</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <h1 className="display text-3xl md:text-4xl">My borrows</h1>
                <Link href="/books" className="group inline-flex items-center gap-2 text-sm font-medium text-secondary">
                    Borrow another book
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/>
                </Link>
            </div>

            {list.length === 0 ? (
                <div className="empty-state mt-10">
                    <p className="display text-xl">Nothing on loan right now</p>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">When you borrow a book it lands here with its due date — seven days, no fees.</p>
                    <Link href="/books" className={cn(buttonVariants({ variant: "default" }), "mt-6")}>Browse the shelf</Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-4">
                    {list.map((b, i) => {
                        const left = daysLeft(b.returnDate);
                        return (
                            <motion.article
                                key={b._id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                className="lift flex flex-col gap-5 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center"
                            >
                                <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                                    <CoverImage src={b.bookImage} alt="" width={72} height={96} className="book-cover"/>
                                </div>
                                <div className="flex-1">
                                    <h2 className="display text-lg leading-snug">{b.bookTitle}</h2>
                                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                        <span>Borrowed {formatDate(b.borrowDate)}</span>
                                        <span>Due {formatDate(b.returnDate)}</span>
                                    </div>
                                    <span className={cn("mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                                        left <= 2
                                            ? "bg-destructive/10 text-destructive"
                                            : "bg-secondary/15 text-secondary")}>
                                        {left <= 2 && <TriangleAlert size={13}/>}
                                        {left > 0 ? `${left} day${left === 1 ? "" : "s"} left` : "Overdue — return it soon"}
                                    </span>
                                </div>
                                <Button variant="default" size="pill" className="shrink-0" disabled={returning === b._id} onClick={() => giveBack(b._id)}>
                                    {returning === b._id && <SpinnerIcon/>}
                                    <RotateCcw size={15}/>Return Book
                                </Button>
                            </motion.article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
