export function titleCase(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function makeId(prefix: string): string {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `${prefix}-${stamp}`;
}

export function tabId(tab: string): string {
  return `AOS-${tab.replaceAll("_", "-").replaceAll(" ", "-").toUpperCase()}`;
}
