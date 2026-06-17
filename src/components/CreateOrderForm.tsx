"use client";

import { useActionState } from "react";
import { createGroupOrder, type FormState } from "@/app/actions";

const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";

export function CreateOrderForm({
  menus,
}: {
  menus: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createGroupOrder,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className={label}>
          Naam van de bestelling
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          autoFocus
          placeholder="bv. Lunch &amp; Learn broodjes"
          className={input}
        />
      </div>

      <div>
        <label htmlFor="menuId" className={label}>
          Menu
        </label>
        <select
          id="menuId"
          name="menuId"
          defaultValue={menus[0]?.id}
          className={input}
        >
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-slate-500">
          Meer menu&apos;s (bv. pizza of pasta) kunnen later worden toegevoegd.
        </p>
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
        {pending ? "Bezig met aanmaken..." : "Bestelling aanmaken"}
      </button>
    </form>
  );
}
