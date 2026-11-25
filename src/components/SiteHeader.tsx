import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="RevMate home">
          <Logo />
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/#how" className="hidden text-muted hover:text-foreground sm:block">
            How it works
          </Link>
          <Link href="/rides" className="hidden text-muted hover:text-foreground sm:block">
            Ride Board
          </Link>
          <Link
            href="/find"
            className="rounded-full bg-accent px-4 py-2 font-semibold text-background transition hover:bg-accent-2"
          >
            Find my bike
          </Link>
        </div>
      </nav>
    </header>
  );
}
