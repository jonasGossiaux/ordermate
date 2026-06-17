import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await isAdmin()) redirect("/");

  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : undefined;

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <Link href="/" className="text-sm text-slate-500 hover:text-navy">
        ← Terug
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-navy">Beheerder inloggen</h1>
        <p className="text-sm text-slate-500">
          Log in om bestellingen te beheren (naam wijzigen, deadline instellen,
          vergrendelen).
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <LoginForm next={safeNext} />
      </div>
    </div>
  );
}
