"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { BookPlus, BookMarked, Layers, Library } from "lucide-react";
import { BarChart, Bar, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "./Spinner";
import { shelfApi } from "@/lib/shelf-api";
import { useSession } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tooltipStyle = {
    contentStyle: {
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: "0.6rem",
        fontSize: "0.8rem",
        color: "var(--popover-foreground)",
        boxShadow: "0 18px 36px -24px rgb(0 0 0 / 0.4)",
    },
    labelStyle: { color: "var(--foreground)", fontWeight: 600 },
};

export default function ProfileView() {
    const { data, isPending } = useSession();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!data)
            return;
        const email = encodeURIComponent(data.user.email);
        Promise.all([
            shelfApi(`/addbooks?email=${email}`),
            shelfApi(`/borrows?email=${email}`),
        ]).then(([books, borrows]) => setStats({ books, borrows })).catch((e) => toast.error(e.message));
    }, [data]);

    if (isPending || !data || !stats)
        return <Spinner label="Loading your profile"/>;

    const { name, email, image } = data.user;
    const { books, borrows } = stats;
    const totalCopies = books.reduce((s, b) => s + (b.totalCopies || 0), 0);
    const availableCopies = books.reduce((s, b) => s + (b.availableCopies || 0), 0);
    const onLoan = totalCopies - availableCopies;

    const byCategory = CATEGORIES
        .map((c) => ({ category: c, copies: books.filter((b) => b.category === c).reduce((s, b) => s + (b.totalCopies || 0), 0) }))
        .filter((d) => d.copies > 0);
    const pieData = [
        { name: "On the shelf", value: availableCopies },
        { name: "On loan", value: onLoan },
    ].filter((d) => d.value > 0);
    const pieColors = ["var(--chart-1)", "var(--chart-2)"];

    const cards = [
        { icon: Library, value: books.length, label: "Books added" },
        { icon: Layers, value: totalCopies, label: "Copies shared" },
        { icon: BookMarked, value: borrows.length, label: "Borrowed now" },
        { icon: BookPlus, value: byCategory.length, label: "Categories used" },
    ];
    const hasData = books.length > 0;

    return (
        <div className="container-page py-12 md:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="eyebrow">Reader profile</p>
                <div className="mt-5 flex flex-col items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center md:p-8">
                    <div className="relative">
                        <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-secondary/50"/>
                        <Image src={image || "/avatar.svg"} alt={name} width={112} height={112} className="relative size-24 rounded-full object-cover ring-1 ring-border md:size-28"/>
                    </div>
                    <div className="flex-1">
                        <h1 className="display text-3xl md:text-4xl">{name}</h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">{email}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Link href="/add-book" className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-full px-4")}>
                                <BookPlus size={15}/>Add a book
                            </Link>
                            <Link href="/my-books" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}>My books</Link>
                            <Link href="/my-borrows" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}>My borrows</Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stat cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((c, i) => (
                    <motion.div
                        key={c.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className="lift rounded-xl bg-card p-6 ring-1 ring-foreground/10"
                    >
                        <c.icon size={20} className="text-secondary"/>
                        <p className="display mt-4 text-4xl">{c.value}</p>
                        <p className="mt-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            {hasData ? (
                <div className="mt-6 grid gap-6 lg:grid-cols-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-xl bg-card p-6 ring-1 ring-foreground/10 lg:col-span-3"
                    >
                        <p className="eyebrow">Your contribution</p>
                        <h2 className="display mt-3 text-xl">Copies by category</h2>
                        <div className="mt-5 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={byCategory} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                                    <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false}/>
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false}/>
                                    <Tooltip cursor={{ fill: "var(--muted)" }} {...tooltipStyle}/>
                                    <Bar dataKey="copies" radius={[6, 6, 0, 0]} barSize={34}>
                                        {byCategory.map((d, i) => (<Cell key={d.category} fill={pieColors[i % pieColors.length] || "var(--chart-3)"}/>))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-xl bg-card p-6 ring-1 ring-foreground/10 lg:col-span-2"
                    >
                        <p className="eyebrow">Right now</p>
                        <h2 className="display mt-3 text-xl">Shelf vs. loan</h2>
                        <div className="mt-5 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={4}>
                                        {pieData.map((d, i) => <Cell key={d.name} fill={pieColors[i % pieColors.length]}/>)}
                                    </Pie>
                                    <Tooltip {...tooltipStyle}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-5 text-xs font-medium">
                            {pieData.map((d, i) => (
                                <span key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="inline-block size-2.5 rounded-full" style={{ background: pieColors[i % pieColors.length] }}/>{d.name}: {d.value}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="empty-state mt-6">
                    <p className="text-muted-foreground">You haven't added any books yet — your shelf stats will appear here.</p>
                    <Link href="/add-book" className={cn(buttonVariants({ variant: "default" }), "mt-5")}>Add your first book</Link>
                </div>
            )}
        </div>
    );
}
