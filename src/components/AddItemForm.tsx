"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { addOrderItem, type FormState } from "@/app/actions";
import type { MenuCategory } from "@/data/menus";

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

  // Onthouden naam (hydration-veilig): leeg op de server, opgeslagen waarde op de client.
  const storedName = useSyncExternalStore(
    emptySubscribe,
    () => window.localStorage.getItem(NAME_KEY) ?? "",
    () => "",
  );
  const [typedName, setTypedName] = useState<string | null>(null);
  const name = typedName ?? storedName;

  const formRef = useRef<HTMLFormElement>(null);

  // Na een geslaagde toevoeging: opmerking en keuze leegmaken (naam blijft staan).
  useEffect(() => {
    if (state?.ok && formRef.current) {
      const form = formRef.current;
      const comment = form.elements.namedItem(
        "comment",
      ) as HTMLInputElement | null;
      const select = form.elements.namedItem(
        "menuItemId",
      ) as HTMLSelectElement | null;
      if (comment) comment.value = "";
      if (select) select.selectedIndex = 0;
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="groupOrderId" value={groupOrderId} />

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
          defaultValue=""
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
        {pending ? "Bezig met toevoegen..." : "+ Toevoegen aan bestelling"}
      </button>
    </form>
  );
}
