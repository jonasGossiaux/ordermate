"use client";

import { useState } from "react";

export function CopySummaryButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Klembord niet beschikbaar — stil falen.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-slate-50"
    >
      {copied ? "Gekopieerd!" : "Kopieer"}
    </button>
  );
}
