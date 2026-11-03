"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import BookCard from "./BookCard";
import { shelfApi, sortNewest } from "@/lib/shelf-api";
import { CATEGORIES } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Home's shelf-dependent sections: newest six titles + the stats band.
// Fetched from Express on mount so it stays in sync with adds and borrows.
export default function LatestShelf() {
    const [books, setBooks] = useState(null);

    useEffect(() => {
        let alive = true;
        shelfApi("/addbooks")
            .then((list) => alive && setBooks(list))
            .catch(() => alive && setBooks([]));
        return () => { alive = false; };
    }, []);

    const latest = books ? sortNewest(books).slice(0, 6) : [];
    const stats = [
        { value: books ? books.length : "—", label: "Titles on the shelf" },
        { value: CATEGORIES.length, label: "Categories to browse" },
        { value: "7", label: "Day loans, no fees" },
    ];

    return (
        <>
            {/* New arrivals */}
            <section className="container-page pt-16 md:pt-24">
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="eyebrow">Fresh on the shelf</p>
                            <h2 className="display mt-4 text-3xl md:text-5xl">New arrivals</h2>
                            <p className="section-sub mt-3 text-muted-foreground">The six books added most recently by the community.</p>
                        </div>
                        <Link href="/books" className="group hidden items-center gap-2 text-sm font-semibold text-secondary sm:flex">
                            See all books
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
                        </Link>
                    </div>
                </Reveal>
                {books !== null && (latest.length === 0 ? (
                    <div className="empty-state mt-10">
                        <p className="display text-xl">The shelf is empty</p>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Be the first to put a book on it.</p>
                        <Link href="/add-book" className={cn(buttonVariants({ variant: "default" }), "mt-6 rounded-full px-5")}>Add the first book</Link>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {latest.map((b, i) => (
                            <Reveal key={b._id} delay={i * 0.06}>
                                <BookCard book={b}/>
                            </Reveal>
                        ))}
                    </div>
                ))}
                <div className="mt-12 text-center sm:hidden">
                    <Link href="/books" className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6")}>See all books</Link>
                </div>
            </section>

            {/* Stats band */}
            <section className="container-page pt-20 md:pt-28">
                <Reveal className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-card px-8 py-10 text-center">
                            <p className="display text-5xl text-gradient md:text-6xl">{s.value}</p>
                            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">{s.label}</p>
                        </div>
                    ))}
                </Reveal>
            </section>
        </>
    );
}
