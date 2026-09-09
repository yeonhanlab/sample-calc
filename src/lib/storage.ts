export const KEYS = {
  history: "retro-calc:history",
  memory: "retro-calc:memory",
  lastState: "retro-calc:last-state",
  settings: "retro-calc:settings",
} as const;

/** Read + JSON-parse a localStorage value, tolerant of SSR and disabled storage. */
export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON-stringify + write, swallowing quota / privacy-mode errors. */
export function saveJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
