// RevMate wordmark: a rev-meter needle pushed toward the red line.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 22a11 11 0 1 1 22 0" fill="none" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
        <path d="M22.5 11.8A11 11 0 0 1 27 22" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 22 L23 13" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="22" r="2.6" fill="var(--foreground)" />
      </svg>
      <span className="font-display text-2xl font-extrabold uppercase tracking-wide">
        Rev<span className="text-accent">Mate</span>
      </span>
    </span>
  );
}
