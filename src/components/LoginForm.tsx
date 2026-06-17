"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/actions";

const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label htmlFor="username" className={label}>
          Gebruikersnaam
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          autoFocus
          className={input}
        />
      </div>

      <div>
        <label htmlFor="password" className={label}>
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-navy px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-navy-soft disabled:opacity-60"
      >
        {pending ? "Bezig met inloggen..." : "Inloggen"}
      </button>
    </form>
  );
}
