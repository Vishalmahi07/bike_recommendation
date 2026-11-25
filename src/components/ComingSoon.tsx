import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function ComingSoon({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <>
      <SiteHeader />
      <main className="relative flex flex-1 items-center overflow-hidden">
        <div className="road-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{label}</p>
          <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.9] sm:text-7xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{text}</p>
          <Link href="/" className="mt-10 inline-flex rounded-full border border-line px-6 py-3 font-semibold hover:border-foreground">
            Back to home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
