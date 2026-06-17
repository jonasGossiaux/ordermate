export function StatusBadge({ status }: { status: string }) {
  const open = status === "open";
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        open ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
      }`}
    >
      {open ? "Open" : "Vergrendeld"}
    </span>
  );
}
