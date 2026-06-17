import type { Menu } from "@/data/menus";

/**
 * Inklapbare menukaart met omschrijvingen. Native <details>, dus geen client-JS.
 */
export function MenuReference({ menu }: { menu: Menu }) {
  const total = menu.categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <details className="group rounded-2xl border border-line bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-semibold text-navy [&::-webkit-details-marker]:hidden">
        <span>Bekijk de volledige menukaart</span>
        <span className="text-sm font-normal text-slate-400">
          <span className="group-open:hidden">{total} broodjes ▾</span>
          <span className="hidden group-open:inline">sluiten ▴</span>
        </span>
      </summary>

      <div className="space-y-5 border-t border-line p-5">
        {menu.categories.map((category) => (
          <div key={category.id}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              {category.name}
            </h3>
            <ul className="space-y-2.5">
              {category.items.map((item) => (
                <li key={item.id} className="text-sm leading-snug">
                  <span className="font-semibold text-navy">{item.name}</span>
                  {item.isNew ? (
                    <span className="ml-1.5 rounded bg-navy/10 px-1.5 py-0.5 text-[11px] font-semibold text-navy align-middle">
                      NIEUW
                    </span>
                  ) : null}
                  {item.soldOut ? (
                    <span className="ml-1.5 text-[11px] font-semibold text-red-500 align-middle">
                      uitverkocht
                    </span>
                  ) : null}
                  {item.description ? (
                    <span className="block text-slate-500">
                      {item.description}
                    </span>
                  ) : null}
                  {item.note ? (
                    <span className="block text-xs text-slate-400">
                      {item.note}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
