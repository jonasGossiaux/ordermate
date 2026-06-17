export function formatDateNL(date: Date): string {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Vaste tijdzone zodat server- en client-rendering identiek zijn (geen
// hydration-mismatch) en de tijd voor het hele team in Belgische tijd klopt.
export function formatDeadlineNL(ms: number): string {
  return new Intl.DateTimeFormat("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Brussels",
  }).format(new Date(ms));
}

/** Relatieve tekst t.o.v. nu, bv. "nog 3 u 12 min" of "verstreken". */
export function formatRelativeNL(targetMs: number, nowMs: number): string {
  const diff = targetMs - nowMs;
  if (diff <= 0) return "verstreken";

  const totalMin = Math.floor(diff / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;

  if (days >= 1) return `nog ${days} d ${hours} u`;
  if (hours >= 1) return `nog ${hours} u ${mins} min`;
  if (mins >= 1) return `nog ${mins} min`;
  return "nog < 1 min";
}
