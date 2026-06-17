"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-slate-50 disabled:opacity-60"
    >
      {pending ? "Vernieuwen…" : "Vernieuwen"}
    </button>
  );
}
