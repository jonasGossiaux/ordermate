"use client";

import { useState, useSyncExternalStore } from "react";
import { setDeadline } from "@/app/actions";

const emptySubscribe = () => () => {};

const input =
  "rounded-lg border border-line bg-white px-3 py-2 text-[15px] outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";

function toLocalInput(ms: number | null): string {
  if (ms == null) return "";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function DeadlineEditor({
  id,
  deadlineMs,
}: {
  id: string;
  deadlineMs: number | null;
}) {
  // Bestaande deadline tonen als lokale datum/tijd — client-only om hydration-
  // mismatch te vermijden (server kent de tijdzone van de browser niet).
  const initial = useSyncExternalStore(
    emptySubscribe,
    () => toLocalInput(deadlineMs),
    () => "",
  );
  const [typed, setTyped] = useState<string | null>(null);
  const local = typed ?? initial;

  // De server verwacht een ISO-tijdstip (UTC). De browser rekent de lokale
  // datum/tijd correct om.
  const iso = local ? new Date(local).toISOString() : "";

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <form action={setDeadline} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="deadline" value={iso} />
          <input
            type="datetime-local"
            aria-label="Deadline"
            value={local}
            onChange={(e) => setTyped(e.target.value)}
            className={input}
          />
          <button
            type="submit"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-soft"
          >
            Opslaan
          </button>
        </form>

        {deadlineMs != null ? (
          <form action={setDeadline}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="deadline" value="" />
            <button
              type="submit"
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Wissen
            </button>
          </form>
        ) : null}
      </div>
      <p className="text-xs text-slate-500">
        Puur informatief. Gebruik de vergrendelknop om bestellen écht te
        stoppen.
      </p>
    </div>
  );
}
