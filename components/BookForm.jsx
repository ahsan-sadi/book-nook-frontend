"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ImagePlus } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { fileToCover } from "@/lib/covers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner as SpinnerIcon } from "@/components/ui/spinner";

const fieldClass = "h-10 w-full";
const readonlyClass = "h-10 w-full opacity-70";
const selectClass = "h-10 w-full appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

export default function BookForm({ initial, user, submitLabel, onSubmit }) {
    const [busy, setBusy] = useState(false);
    const handle = async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        try {
            let image = initial?.image || "";
            const file = f.get("image");
            if (file && file.size > 0)
                image = await fileToCover(file);
            if (!image)
                throw new Error("Please choose a cover image.");
            await onSubmit({
                title: String(f.get("title")), author: String(f.get("author")), category: String(f.get("category")),
                description: String(f.get("description")), totalCopies: Number(f.get("totalCopies")), image,
            });
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save the book.");
        }
        finally {
            setBusy(false);
        }
    };
    return (
        <form onSubmit={handle} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
                <Label htmlFor="book-title">Book title</Label>
                <Input id="book-title" name="title" required defaultValue={initial?.title} placeholder="The Left Hand of Darkness" className={fieldClass}/>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="book-author">Author name</Label>
                <Input id="book-author" name="author" required defaultValue={initial?.author} placeholder="Ursula K. Le Guin" className={fieldClass}/>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="book-category">Category</Label>
                <div className="relative">
                    <select id="book-category" name="category" required defaultValue={initial?.category || CATEGORIES[0]} className={selectClass}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="book-copies">Total copies</Label>
                <Input id="book-copies" name="totalCopies" type="number" min={1} required defaultValue={initial?.totalCopies ?? 1} className={fieldClass}/>
            </div>

            <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="book-image">
                    Book image
                    {initial?.image && <span className="text-xs font-normal text-muted-foreground">(leave empty to keep the current cover)</span>}
                </Label>
                <div className="relative flex items-center">
                    <ImagePlus size={16} className="pointer-events-none absolute left-3 text-muted-foreground"/>
                    <input
                        id="book-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="h-10 w-full cursor-pointer rounded-lg border border-input bg-transparent pl-9 text-sm transition-colors outline-none file:mr-3 file:h-6 file:cursor-pointer file:rounded-md file:border-0 file:bg-muted file:px-2.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                    />
                </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="book-description">Short description</Label>
                <Textarea id="book-description" name="description" required rows={4} defaultValue={initial?.description} placeholder="What should the next reader know?" className={fieldClass}/>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="book-owner">Your name</Label>
                <Input id="book-owner" value={user.name} readOnly className={readonlyClass}/>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="book-email">Your email</Label>
                <Input id="book-email" value={user.email} readOnly className={readonlyClass}/>
            </div>

            <Button type="submit" size="xl" disabled={busy} className="mt-1 md:col-span-2">
                {busy && <SpinnerIcon />}{submitLabel}
            </Button>
        </form>
    );
}
