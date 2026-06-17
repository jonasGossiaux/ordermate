"use client";

import { useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ShareLink() {
  // Hydration-veilig de huidige URL lezen: leeg op de server, echte URL op de client.
  const url = useSyncExternalStore(
    emptySubscribe,
    () => window.location.href,
    () => "",
  );
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Klembord niet beschikbaar — stil falen.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate-500">
      <span className="shrink-0">Deel-link:</span>
      <code className="flex-1 truncate text-navy">{url || "…"}</code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md border border-line px-2.5 py-1 text-xs font-semibold text-navy hover:bg-slate-50"
      >
        {copied ? "Gekopieerd!" : "Kopieer"}
      </button>
    </div>
  );
}
