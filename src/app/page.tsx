import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Gauge,
  MapPin,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroChat from "@/components/HeroChat";

const promises = [
  { icon: ShieldCheck, title: "Every brand, no bias", text: "No sponsored picks. We match bikes to you, not to a dealer." },
  { icon: Ruler, title: "Fit to your body", text: "Seat height and weight checked against your height and build." },
  { icon: BadgeCheck, title: "Real data only", text: "Prices and specs come from our checked list, never guessed by the AI." },
  { icon: MapPin, title: "Built for Chennai", text: "On-road prices, showrooms and rides near you." },
];

const steps = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Tell it like you'd tell a friend",
    text: "Budget, mileage, style, height, who rides with you. Type it the way you'd say it.",
  },
  {
    n: "02",
    icon: Gauge,
    title: "Answer two quick questions",
    text: "RevMate asks only what's missing, then shows 2 to 3 bikes with a fit score for each.",
  },
  {
    n: "03",
    icon: Store,
    title: "Get one pick and a plan to buy",
    text: "Your best bike, the on-road price, the nearest showroom, a test ride and the papers you need.",
  },
];

const fitChecks = [
  { label: "Feet flat at signals", ok: true },
  { label: "Easy to push and park", ok: true },
  { label: "Pillion seat for daily rides", ok: true },
  { label: "Mileage in your range", ok: true },
];

const rideFeatures = [
  { icon: CalendarDays, text: "Clubs post rides with date, route and meeting point" },
  { icon: ShieldCheck, text: "Every post checked before it goes live" },
  { icon: Users, text: "Register in one tap; seats are limited" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="road-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.15fr_1fr] lg:pt-24">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                AI bike finder for Chennai riders
              </p>
              <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Find the bike
                <br />
                that <span className="text-accent">fits you.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted">
                Tell RevMate your budget, height and riding style. Get one honest pick, the nearest showroom, and a crew
                to ride with.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/find"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-background transition hover:bg-accent-2"
                >
                  Find my bike
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/rides"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition hover:border-foreground"
                >
                  See upcoming rides
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <HeroChat />
            </div>
          </div>
        </section>

        {/* Promises */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-surface p-6">
                <Icon className="text-accent" size={22} />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
            One chat. One bike. <span className="text-outline whitespace-nowrap">No tab-hopping.</span>
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(({ n, icon: Icon, title, text }) => (
              <div key={n} className="group relative rounded-3xl border border-line bg-surface p-7 transition hover:border-accent/60">
                <span className="font-display text-6xl font-black text-line transition group-hover:text-accent/40">{n}</span>
                <Icon className="mt-4 text-accent" size={26} />
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fit */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">Fit check</p>
              <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
                A great bike that doesn&apos;t fit is the wrong bike.
              </h2>
              <p className="mt-5 max-w-lg text-lg text-muted">
                Spec sheets don&apos;t tell you if you can touch the ground at a signal. RevMate checks seat height, weight
                and pillion comfort against your body before it recommends anything.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-background p-7">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold">Fit check</p>
                <p className="text-xs text-muted">Example rider: 5&apos;5&quot;, 70 kg</p>
              </div>
              <ul className="mt-6 space-y-3">
                {fitChecks.map(({ label }) => (
                  <li key={label} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3.5">
                    <span>{label}</span>
                    <BadgeCheck className="text-emerald-400" size={20} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted">Every recommended bike shows its own fit check.</p>
            </div>
          </div>
        </section>

        {/* Ride Board */}
        <section className="mx-auto max-w-6xl px-5 py-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-surface-2 to-background p-8 sm:p-12">
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/15 blur-[100px]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-accent">Ride Board</p>
                <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">
                  Found your bike? Find your crew.
                </h2>
                <p className="mt-5 max-w-lg text-lg text-muted">
                  Chennai has dozens of riding clubs spread across WhatsApp groups and pages. The Ride Board puts their
                  rides in one place, so you can join one this weekend.
                </p>
                <Link
                  href="/rides"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-semibold transition hover:border-foreground"
                >
                  Browse rides <ArrowRight size={18} />
                </Link>
              </div>
              <ul className="space-y-3">
                {rideFeatures.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-4 rounded-2xl border border-line bg-background/60 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={20} />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-24 text-center">
          <h2 className="mx-auto max-w-3xl font-display text-6xl font-black uppercase leading-[0.9] sm:text-7xl">
            Your next bike is <span className="text-accent">one chat away.</span>
          </h2>
          <Link
            href="/find"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-background transition hover:bg-accent-2"
          >
            Find my bike
            <ArrowRight size={20} className="transition group-hover:translate-x-1" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
