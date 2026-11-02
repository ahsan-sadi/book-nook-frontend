"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BookForm from "./BookForm";
import Spinner from "./Spinner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function AddBookView() {
    const { data, isPending } = useSession();
    const router = useRouter();
    if (isPending || !data)
        return <Spinner />;
    return (
        <div className="container-page max-w-3xl py-12 md:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="eyebrow">Share your shelf</p>
                <h1 className="display mt-4 text-3xl md:text-4xl">Add a book</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Fill in the details below — once it's on the shelf, anyone in the community can borrow it for seven days at a time.</p>
                <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                    <BookForm
                        user={{ name: data.user.name, email: data.user.email }}
                        submitLabel="Add to the shelf"
                        onSubmit={async (v) => {
                            await api("/books", {
                                method: "POST",
                                body: { ...v, addedByName: data.user.name, addedByEmail: data.user.email },
                                auth: true,
                            });
                            toast.success("Book added to the shelf.");
                            router.push("/my-books");
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
