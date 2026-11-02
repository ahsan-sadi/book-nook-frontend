export default function AuthShell({ title, subtitle, children }) {
    return (<div className="container-page grid items-stretch gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
      {/* Editorial side panel */}
      <aside className="grain relative hidden overflow-hidden rounded-2xl bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(217,173,76,0.25),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(95,181,150,0.18),transparent_60%)]"/>
        <p className="eyebrow relative text-secondary">The Reading Room</p>
        <blockquote className="relative my-10">
          <p className="display text-3xl xl:text-4xl">“A reader lives a thousand lives before he dies.”</p>
          <footer className="mt-5 text-sm tracking-wide text-paper/60">— George R.R. Martin</footer>
        </blockquote>
        <ul className="relative flex gap-8 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-paper/60">
          <li>Add books</li>
          <li>Borrow 7 days</li>
          <li>Return anytime</li>
        </ul>
      </aside>

      {/* Form column */}
      <div className="mx-auto w-full max-w-md">
        <p className="eyebrow">Welcome</p>
        <h1 className="display mt-4 text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>);
}
