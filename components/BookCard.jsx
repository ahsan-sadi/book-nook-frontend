import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import CoverImage from "./CoverImage";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BookCard({ book }) {
    const soldOut = book.availableCopies <= 0;
    return (
        <article className="lift group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <figure className="relative overflow-hidden bg-muted">
                <CoverImage
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    width={400}
                    height={533}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="book-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"/>
                <Badge className={cn("absolute left-3 top-3 shadow-sm", soldOut
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-secondary-foreground")}>
                    {soldOut ? "Out of stock" : `${book.availableCopies} left`}
                </Badge>
                <span className="chip chip-active absolute bottom-3 left-3 scale-95 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">{book.category}</span>
            </figure>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
                <p className="eyebrow before:hidden text-[0.62rem] text-muted-foreground">{book.author}</p>
                <h3 className="display line-clamp-2 text-lg leading-snug" title={book.title}>{book.title}</h3>
                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <BookOpen size={14}/>{book.availableCopies}/{book.totalCopies} copies
                    </span>
                    <Link href={`/books/${book._id}`} className={cn(buttonVariants({ variant: "default", size: "sm" }), "group/btn rounded-full")}>
                        Read
                        <ArrowUpRight size={15} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"/>
                    </Link>
                </div>
            </div>
        </article>
    );
}
