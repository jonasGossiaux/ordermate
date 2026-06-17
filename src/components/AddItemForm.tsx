"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { addOrderItem, type FormState } from "@/app/actions";
import type { MenuCategory, MenuItem } from "@/data/menus";

const NAME_KEY = "ordermate:name";
const emptySubscribe = () => () => {};

const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-navy focus:ring-2 focus:ring-navy/15";

export function AddItemForm({
  groupOrderId,
  categories,
}: {
  groupOrderId: string;
  categories: MenuCategory[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    addOrderItem,
    null,
  );

  // Elke geslaagde toevoeging geeft een uniek itemId terug. Dat gebruiken we als
  // remount-sleutel: zo komen het broodje en de opmerking leeg na het toevoegen,
  // terwijl de naam bewaard blijft (die komt uit localStorage).
  const resetKey = state?.ok && state.itemId ? state.itemId : "fields";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="groupOrderId" value={groupOrderId} />
      <Fields
        key={resetKey}
        categories={categories}
        pending={pending}
        error={state?.error}
      />
    </form>
  );
}

function Fields({
  categories,
  pending,
  error,
}: {
  categories: MenuCategory[];
  pending: boolean;
  error?: string;
}) {
  // Onthouden naam (hydration-veilig): leeg op de server, opgeslagen waarde op de client.
  const storedName = useSyncExternalStore(
    emptySubscribe,
    () => window.localStorage.getItem(NAME_KEY) ?? "",
    () => "",
  );
  const [typedName, setTypedName] = useState<string | null>(null);
  const name = typedName ?? storedName;

  const [menuItemId, setMenuItemId] = useState("");
  const selected = findItem(categories, menuItemId);

  return (
    <>
      <div>
        <label className={label} htmlFor="personName">
          Jouw naam
        </label>
        <input
          id="personName"
          name="personName"
          required
          maxLength={80}
          value={name}
          onChange={(e) => {
            setTypedName(e.target.value);
            window.localStorage.setItem(NAME_KEY, e.target.value);
          }}
          placeholder="bv. Jonas"
          className={input}
        />
      </div>

      <div>
        <label className={label} htmlFor="menuItemId">
          Kies je broodje
        </label>
        <select
          id="menuItemId"
          name="menuItemId"
          required
          value={menuItemId}
          onChange={(e) => setMenuItemId(e.target.value)}
          className={input}
        >
          <option value="" disabled>
            — Kies een broodje —
          </option>
          {categories.map((category) => (
            <optgroup key={category.id} label={category.name}>
              {category.items.map((item) => (
                <option key={item.id} value={item.id} disabled={item.soldOut}>
                  {item.name}
                  {item.soldOut
                    ? " (uitverkocht)"
                    : item.isNew
                      ? " • NIEUW"
                      : ""}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {selected?.description ? (
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {selected.description}
            {selected.note ? (
              <span className="mt-1 block text-xs text-slate-500">
                {selected.note}
              </span>
            ) : null}
          </p>
        ) : (
          <p className="mt-2 text-xs text-slate-400">
            Kies een broodje om de ingrediënten te zien.
          </p>
        )}
      </div>

      <div>
        <label className={label} htmlFor="comment">
          Opmerking (optioneel)
        </label>
        <input
          id="comment"
          name="comment"
          maxLength={300}
          placeholder="bv. geen groentjes"
          className={input}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-navy px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-navy-soft disabled:opacity-60"
      >
        {pending ? "Bezig met toevoegen..." : "+ Toevoegen aan bestelling"}
      </button>
    </>
  );
}

function findItem(
  categories: MenuCategory[],
  id: string,
): MenuItem | undefined {
  if (!id) return undefined;
  for (const category of categories) {
    const item = category.items.find((entry) => entry.id === id);
    if (item) return item;
  }
  return undefined;
}
