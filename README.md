# RevMate

AI riding buddy for Chennai: finds the bike that fits you, then helps you find a crew to ride with.

## Stack

Next.js (App Router) + TypeScript, Tailwind CSS, Framer Motion. Coming next: Supabase (database, login), Claude API via the Vercel AI SDK, hosted on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Change the look

All colours live in `src/app/globals.css` under `:root`. Fonts are set in `src/app/layout.tsx`.

## Pages

| Route | Status |
| --- | --- |
| `/` | Landing page |
| `/find` | AI bike finder (Week 2) |
| `/rides` | Ride Board (Week 3) |
