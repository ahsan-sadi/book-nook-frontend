"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const slides = [
    { eyebrow: "The Reading Room", title: <>Your neighbours' bookshelves, <em className="text-gradient not-italic">in one place</em></>, text: "Browse books shared by readers in your community and find your next weekend read.", cta: "Browse the shelf" },
    { eyebrow: "Seven days, zero fees", title: <>Borrow for a week, <em className="text-gradient not-italic">no card needed</em></>, text: "Pick a title, confirm, and it's yours for seven days. Return it with one tap from My Borrows.", cta: "See how it works" },
    { eyebrow: "Share your shelf", title: <>Got books <em className="text-gradient not-italic">gathering dust?</em></>, text: "Add them to BookNook and let other readers enjoy them while you track every copy.", cta: "Add a book" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
const item = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

// Decorative floating book spines — pure CSS, animates with .animate-float
function BookOrnament() {
    const spines = [
        { w: "w-16", h: "h-56", bg: "bg-primary", rot: "-rotate-6", delay: "0s" },
        { w: "w-14", h: "h-64", bg: "bg-secondary", rot: "rotate-3", delay: "0.7s" },
        { w: "w-16", h: "h-48", bg: "bg-chart-3", rot: "rotate-[8deg]", delay: "1.3s" },
    ];
    return (<div className="relative hidden h-72 w-64 lg:block" aria-hidden="true">
      {spines.map((s, i) => (<motion.div
        key={i}
        initial={{ opacity: 0, y: 40, rotate: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute ${s.w} ${s.h} ${s.bg} ${s.rot} rounded-md shadow-2xl animate-float`} style={{ animationDelay: s.delay, left: `${i * 62}px`, top: `${i * 14}px` }}>
        <div className="mx-2 mt-4 h-px bg-white/40"/>
        <div className="mx-2 mt-2 h-px bg-white/40"/>
        <div className="mx-auto mt-3 h-24 w-px bg-white/30"/>
      </motion.div>))}
      <div className="absolute inset-x-0 bottom-0 h-10 rounded-[100%] bg-black/30 blur-xl"/>
    </div>);
}

export default function HeroSlider() {
    const [active, setActive] = useState(0);
    return (<section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Layered lamp-light background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_75%_20%,rgba(217,173,76,0.22),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_90%,rgba(95,181,150,0.18),transparent_60%)]"/>
      <Swiper
        modules={[Autoplay, Pagination, Keyboard]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        loop
        onSlideChange={(s) => setActive(s.realIndex)}
        className="w-full">
        {slides.map((s, i) => (<SwiperSlide key={i}>
          <div className="relative">
            <div className="container-page flex min-h-[30rem] flex-col items-start justify-center gap-6 py-20 md:min-h-[36rem]">
              <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <motion.div
                  key={active === i ? "in" : "out"}
                  variants={container}
                  initial="hidden"
                  animate={active === i ? "show" : "hidden"}
                  className="max-w-2xl">
                  <motion.p variants={item} className="eyebrow text-secondary">{s.eyebrow}</motion.p>
                  <motion.h1 variants={item} className="display mt-5 text-4xl md:text-6xl">{s.title}</motion.h1>
                  <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-paper/75">{s.text}</motion.p>
                  <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                    <Link href="/books" className={cn(buttonVariants({ variant: "secondary", size: "xl" }), "shadow-lg shadow-black/20")}>{s.cta}</Link>
                    <Link href="#how" className={buttonVariants({ variant: "lightOutline", size: "xl" })}>How borrowing works</Link>
                  </motion.div>
                </motion.div>
                <BookOrnament/>
              </div>
            </div>
            {/* Bottom rule with slide index */}
            <div className="container-page pointer-events-none absolute inset-x-0 bottom-5 hidden justify-end md:flex">
              <span className="text-sm tabular-nums text-secondary" style={{ fontFamily: "var(--font-display)" }}>
                0{active + 1} <span className="opacity-40">/ 0{slides.length}</span>
              </span>
            </div>
          </div>
        </SwiperSlide>))}
      </Swiper>
    </section>);
}
