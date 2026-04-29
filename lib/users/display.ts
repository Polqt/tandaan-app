export function getDisplayInitials(name: string, fallback = "?") {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return fallback;
  }

  return trimmedName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}
