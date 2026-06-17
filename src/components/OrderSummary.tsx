import type { OrderItem } from "@/db/schema";
import { CopySummaryButton } from "./CopySummaryButton";

type Group = { menuItemId: string; name: string; entries: OrderItem[] };

function groupItems(items: OrderItem[]): Group[] {
  const groups = new Map<string, Group>();
  for (const item of items) {
    const existing = groups.get(item.menuItemId);
    if (existing) {
      existing.entries.push(item);
    } else {
      groups.set(item.menuItemId, {
        menuItemId: item.menuItemId,
        name: item.itemName,
        entries: [item],
      });
    }
  }
  return [...groups.values()].sort(
    (a, b) => b.entries.length - a.entries.length || a.name.localeCompare(b.name),
  );
}

function personLabel(item: OrderItem): string {
  return item.comment ? `${item.personName} (${item.comment})` : item.personName;
}

function buildSummaryText(
  title: string,
  menuName: string,
  groups: Group[],
): string {
  const lines = [`${title} — ${menuName}`, ""];
  for (const group of groups) {
    lines.push(`${group.entries.length}x ${group.name}`);
    for (const entry of group.entries) {
      lines.push(`   - ${personLabel(entry)}`);
    }
  }
  return lines.join("\n");
}

export function OrderSummary({
  items,
  title,
  menuName,
}: {
  items: OrderItem[];
  title: string;
  menuName: string;
}) {
  const groups = groupItems(items);
  const total = items.length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">
          Samenvatting voor de winkel
        </h2>
        {total > 0 && (
          <CopySummaryButton text={buildSummaryText(title, menuName, groups)} />
        )}
      </div>

      {total === 0 ? (
        <p className="py-2 text-sm text-slate-500">
          Nog niets om samen te vatten.
        </p>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group.menuItemId} className="flex items-start gap-3">
              <span className="mt-0.5 min-w-[38px] shrink-0 rounded-md bg-navy px-2 py-1 text-center text-sm font-bold text-white">
                {group.entries.length}×
              </span>
              <div>
                <div className="font-semibold">{group.name}</div>
                <div className="text-sm text-slate-500">
                  {group.entries.map(personLabel).join(", ")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
