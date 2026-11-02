"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import Reveal from "./Reveal";
import BookCard from "./BookCard";
import { useShelf } from "@/lib/store";
import { filterBooks } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Catalogue: filters the local shelf live while typing, keeps the URL in sync
// on submit so searches stay shareable.
export default function BooksView({ search = "", category = "All" }) {
    const router = useRouter();
    const shelf = useShelf();
    const [term, setTerm] = useState(search);

    const books = filterBooks(shelf.books, { search: term, category });

    const hrefFor = (nextCategory, nextTerm = term) => {
        const p = new URLSearchParams();
        if (nextCategory && nextCategory !== "All")
            p.set("category", nextCategory);
        if (nextTerm)
            p.set("search", nextTerm);
        return p.size ? `/books?${p}` : "/books";
    };

    const submit = (e) => {
        e.preventDefault();
        router.push(hrefFor(category));
    };

    return (
        <div className="container-page py-12 md:py-16">
            <p className="eyebrow">The catalogue</p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <h1 className="display text-3xl md:text-5xl">All books</h1>
                <p className="text-sm text-muted-foreground">
                    {books.length} {books.length === 1 ? "title" : "titles"}
                    {category !== "All" && ` in ${category}`}
                    {term && <> matching “{term}”</>}
                </p>
            </div>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row" role="search">
                <div className="relative w-full sm:max-w-sm">
                    <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        key={search}
                        name="search"
                        defaultValue={search}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="Search by title or author…"
                        aria-label="Search by title or author"
                        className="h-11 rounded-full pl-11 pr-4"
                    />
                    {category !== "All" && <input type="hidden" name="category" value={category}/>}
                </div>
                <Button type="submit" size="lg" className="rounded-full px-8">Search</Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
                {["All", ...CATEGORIES].map((c) => (
                    <Link
                        key={c}
                        href={hrefFor(c)}
                        className={cn("chip", c === category && "chip-active")}
                        aria-current={c === category ? "page" : undefined}>
                        {c}
                    </Link>
                ))}
            </div>

            {books.length === 0 ? (
                <div className="empty-state mt-12">
                    <p className="display text-xl">Nothing on the shelf matches</p>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                        Try another search term or category — or add the book yourself.
                    </p>
                    <Link href="/add-book" className={cn(buttonVariants({ variant: "default" }), "mt-6 gap-1.5 rounded-full px-5")}>
                        <Plus size={15}/>
                        Add it to BookNook
                    </Link>
                </div>
            ) : (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {books.map((b, i) => (
                        <Reveal key={b._id} delay={Math.min(i * 0.05, 0.4)}>
                            <BookCard book={b}/>
                        </Reveal>
                    ))}
                </div>
            )}
        </div>
    );
}
