import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrderMate — samen bestellen",
  description:
    "Maak een groepsbestelling en laat collega's hun broodje kiezen. Bekijk daarna één duidelijke lijst voor de winkel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="bg-navy text-white">
          <div className="mx-auto flex w-full max-w-3xl items-center px-5 py-4">
            <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-wide">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
              OrderMate
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-3xl px-5 py-6 text-center text-xs text-slate-400">
          OrderMate · samen bestellen
        </footer>
      </body>
    </html>
  );
}
