import Link from "next/link";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Your riding buddy in Chennai. Honest bike picks across every brand, and a crew to ride with.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">RevMate</p>
          <Link href="/find" className="text-muted hover:text-foreground">Find my bike</Link>
          <Link href="/rides" className="text-muted hover:text-foreground">Ride Board</Link>
          <Link href="/#how" className="text-muted hover:text-foreground">How it works</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Good to know</p>
          <p className="text-muted">Prices are indicative. Confirm with the dealer.</p>
          <p className="text-muted">Rides are run by clubs. Helmet and gear required.</p>
        </div>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">
        © 2026 RevMate · Made in Chennai
      </p>
    </footer>
  );
}
