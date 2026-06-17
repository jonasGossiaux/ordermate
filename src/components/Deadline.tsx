"use client";

import { useSyncExternalStore } from "react";
import { formatDeadlineNL, formatRelativeNL } from "@/lib/format";

// Tikkende "nu": null op de server en bij de eerste render (geen hydration-
// mismatch), daarna de echte tijd, die elke 30 s ververst.
function useNow(): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 30000);
      return () => clearInterval(id);
    },
    () => Date.now(),
    () => null,
  );
}

export function Deadline({
  deadlineMs,
  compact = false,
}: {
  deadlineMs: number;
  compact?: boolean;
}) {
  const now = useNow();
  const passed = now !== null && now >= deadlineMs;
  const absolute = formatDeadlineNL(deadlineMs);
  const relative = now === null ? null : formatRelativeNL(deadlineMs, now);

  if (compact) {
    return (
      <span
        className={passed ? "text-amber-600" : "text-slate-500"}
        title={`Deadline: ${absolute}`}
      >
        ⏰ {passed ? "deadline verstreken" : absolute}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-3.5 py-2.5 text-sm ${
        passed
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-line bg-white text-slate-700"
      }`}
    >
      <span aria-hidden>⏰</span>
      <span className="font-semibold">
        {passed ? "Deadline verstreken" : "Bestellen tot"}
      </span>
      <span>{absolute}</span>
      {relative && !passed ? (
        <span className="rounded-full bg-navy/5 px-2 py-0.5 text-xs font-medium text-navy">
          {relative}
        </span>
      ) : null}
    </div>
  );
}
