"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import BookForm from "./BookForm";
import ConfirmModal from "./ConfirmModal";
import Spinner from "./Spinner";
import CoverImage from "./CoverImage";
import { shelfApi } from "@/lib/shelf-api";
import { useSession } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function MyBooksView() {
  const { data: session } = useSession();
  const [books, setBooks] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  // Read the owner's shelf once per mount — never during render, or every setBooks
  // re-triggers the fetch and loops. `?email=` now requires a JWT for that same
  // reader, and only their books come back (they're the only ones editable).
  const load = useCallback(() => {
    if (!session) return;
    shelfApi(`/addbooks?email=${encodeURIComponent(session.user.email)}`)
      .then(setBooks)
      .catch((e) => toast.error(e.message));
  }, [session]);
  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await shelfApi(`/addbooks/${deleting._id}`, { method: "DELETE" });
      setBooks(books.filter((b) => b._id !== deleting._id));
      toast.success("Book deleted.");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  };

  if (!session || !books) return <Spinner label="Loading your books" />;

  const totalCopies = books.reduce((s, b) => s + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce(
    (s, b) => s + (b.availableCopies || 0),
    0,
  );

  return (
    <div className="container-page py-12 md:py-16">
      <p className="eyebrow">Your contribution</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl md:text-4xl">My books</h1>
          {books.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {books.length} titles · {totalCopies} copies · {availableCopies}{" "}
              on the shelf
            </p>
          )}
        </div>
        <Link
          href="/add-book"
          className={cn(
            buttonVariants({ variant: "default" }),
            "gap-1.5 rounded-full px-4",
          )}
        >
          <Plus size={16} />
          Add a book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="empty-state mt-10">
          <p className="display text-xl">Your shelf is waiting</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Add the books gathering dust at home and let your neighbours borrow
            them.
          </p>
          <Link
            href="/add-book"
            className={cn(buttonVariants({ variant: "default" }), "mt-6")}
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((b, i) => (
            <motion.article
              key={b._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lift group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10"
            >
              <figure className="relative overflow-hidden bg-muted">
                <CoverImage
                  src={b.image}
                  alt=""
                  width={400}
                  height={533}
                  className="book-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Badge
                  className={cn(
                    "absolute left-3 top-3 shadow-sm",
                    b.availableCopies > 0
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-destructive text-destructive-foreground",
                  )}
                >
                  {b.availableCopies}/{b.totalCopies} available
                </Badge>
              </figure>
              <div className="flex flex-1 flex-col p-4">
                <span className="eyebrow before:hidden text-[0.62rem] text-muted-foreground">
                  {b.category}
                </span>
                <h2 className="display mt-1.5 line-clamp-2 text-base leading-snug">
                  {b.title}
                </h2>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-primary"
                    onClick={() => setEditing(b)}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                    onClick={() => setDeleting(b)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Dialog
        open={!!editing}
        onOpenChange={(next) => {
          if (!next) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <span className="eyebrow">Update the record</span>
            <DialogTitle className="display mt-1 text-xl">
              Edit book
            </DialogTitle>
            <DialogDescription>
              Changes show up on the shelf right away.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <BookForm
              initial={editing}
              user={{ name: session.user.name, email: session.user.email }}
              submitLabel="Save changes"
              onSubmit={async () => {
                // BookForm already PATCHed Mongo — refresh the shelf.
                toast.success("Changes saved.");
                setEditing(null);
                load();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!deleting}
        title="Delete this book?"
        message={
          deleting
            ? `“${deleting.title}” will be removed from the shelf for everyone.`
            : ""
        }
        confirmLabel="Delete"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
