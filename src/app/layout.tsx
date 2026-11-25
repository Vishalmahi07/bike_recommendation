import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are bundled in src/fonts (OFL licensed) so builds never depend on Google Fonts.
const display = localFont({
  src: "../fonts/big-shoulders-latin-wght.woff2",
  variable: "--font-display",
  weight: "100 900",
});

const body = localFont({
  src: "../fonts/inter-latin-wght.woff2",
  variable: "--font-body",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RevMate — Find the bike that fits you",
  description:
    "Tell RevMate your budget, height and riding style. Get one honest bike pick, the nearest showroom in Chennai, and a crew to ride with.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
