import { isValidUsername } from "@/lib/tiktok";

const KEY = "tractiktok:history";
export const HISTORY_LIMIT = 5;

/** Only usernames are stored — never photos or profile data. */
export function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.filter((x): x is string => typeof x === "string" && isValidUsername(x)).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveHistory(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, HISTORY_LIMIT)));
  } catch {
    /* storage unavailable — history is a convenience only */
  }
}

export function pushHistory(list: string[], username: string) {
  const next = [username, ...list.filter((u) => u.toLowerCase() !== username.toLowerCase())];
  return next.slice(0, HISTORY_LIMIT);
}
