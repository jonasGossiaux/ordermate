export function formatDateNL(date: Date): string {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
