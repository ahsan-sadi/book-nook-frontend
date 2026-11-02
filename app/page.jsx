import Link from "next/link";
import { ArrowRight, Search, HandCoins, Undo2 } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import LatestShelf from "@/components/LatestShelf";
import Reveal from "@/components/Reveal";
import { CATEGORIES } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Home" };

const steps = [
    { icon: Search, title: "Find a book", text: "Search the shelf by title, author or category — the whole catalogue is open to browse." },
    { icon: HandCoins, title: "Borrow it", text: "Confirm your details and it's yours for 7 days. One copy off the shelf, tracked instantly." },
    { icon: Undo2, title: "Return it", text: "Tap Return in My Borrows and the copy goes straight back on the shelf for the next reader." },
];
const blurbs = {
    Fiction: "Novels and short stories", Science: "Curious minds, big ideas", History: "People and places that shaped us", Kids: "Picture books to early readers", Others: "Everything in between",
};
const ticker = ["Add a book", "Borrow for a week", "Return with one tap", "No late fees", "Community shelves", "Seven-day loans"];

export default function Home() {
    return (<>
      <HeroSlider />

      {/* Editorial ticker band */}
      <div className="overflow-hidden border-y border-border bg-muted py-3.5" aria-hidden="true">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (<div key={k} className="flex shrink-0 items-center">
            {ticker.map((t) => (<span key={t} className="display flex items-center gap-8 px-8 text-lg opacity-75">
              {t}<span className="text-secondary">✦</span>
            </span>))}
          </div>))}
        </div>
      </div>

      {/* New arrivals + stats (reads the live shelf) */}
      <LatestShelf />

      {/* How it works */}
      <section id="how" className="container-page scroll-mt-24 pt-20 md:pt-28">
        <Reveal>
          <p className="eyebrow">The ritual</p>
          <h2 className="display mt-4 text-3xl md:text-5xl">How borrowing works</h2>
        </Reveal>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (<Reveal key={s.title} delay={i * 0.1}>
            <li className="relative h-full border-t-2 border-border pt-6 transition-colors hover:border-secondary">
              <span className="display absolute -top-0.5 right-0 text-6xl text-border select-none">0{i + 1}</span>
              <s.icon size={26} className="text-secondary"/>
              <h3 className="display mt-4 text-xl">{s.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          </Reveal>))}
        </ol>
      </section>

      {/* Categories */}
      <section className="container-page pt-20 md:pt-28">
        <Reveal>
          <p className="eyebrow">Wander the aisles</p>
          <h2 className="display mt-4 text-3xl md:text-5xl">Top categories</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (<Reveal key={c} delay={i * 0.05}>
            <Link href={`/books?category=${c}`} className="lift group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 hover:border-secondary">
              <div>
                <h3 className="display text-lg">{c}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{blurbs[c]}</p>
              </div>
              <ArrowRight size={16} className="mt-6 text-secondary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"/>
            </Link>
          </Reveal>))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-page pb-6 pt-20 md:pt-28">
        <Reveal className="grain relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-paper md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(217,173,76,0.25),transparent_70%)]"/>
          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow justify-center text-secondary">Your shelf, shared</p>
            <h2 className="display mt-5 text-3xl md:text-5xl">Got books gathering dust?</h2>
            <p className="mx-auto mt-4 max-w-lg text-paper/75">Add them to BookNook in a minute and let your neighbours enjoy them — while you keep track of every copy.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className={cn(buttonVariants({ variant: "secondary", size: "xl" }), "rounded-full px-8")}>Start your shelf</Link>
              <Link href="/books" className={cn(buttonVariants({ variant: "lightOutline", size: "xl" }), "rounded-full px-8")}>Browse first</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>);
}
