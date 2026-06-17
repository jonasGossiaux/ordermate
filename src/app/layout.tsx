import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { isAdmin } from "@/lib/auth";
import { logout } from "@/app/actions";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await isAdmin();

  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-10 border-b border-line bg-cream/85 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3">
            <Link href="/" aria-label="ordermate — home" className="flex items-center">
              <Image
                src="/ordermate-logo.png"
                alt="ordermate"
                width={800}
                height={160}
                priority
                className="h-7 w-auto sm:h-8"
              />
            </Link>
            {admin ? (
              <form action={logout} className="flex items-center gap-2.5">
                <span className="hidden text-xs text-slate-500 sm:inline">
                  Beheerder
                </span>
                <button
                  type="submit"
                  className="rounded-md px-2.5 py-1 text-sm font-medium text-slate-600 hover:bg-navy/5 hover:text-navy"
                >
                  Uitloggen
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-md px-2.5 py-1 text-sm font-medium text-slate-600 hover:bg-navy/5 hover:text-navy"
              >
                Inloggen
              </Link>
            )}
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-3xl px-5 py-8 text-center text-xs text-slate-400">
          ordermate · samen bestellen
        </footer>
      </body>
    </html>
  );
}
