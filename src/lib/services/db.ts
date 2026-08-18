import type { Database } from "@/types";
import { createSeedDatabase } from "@/data/seed";

/**
 * Demo data adapter.
 *
 * All reads/writes in the app go through the store which calls into this
 * adapter. Swapping this file for Firestore (collection reads + a transaction
 * inside `verifyMatch`) does not require any UI change.
 */
export const STORAGE_KEY = "khelolocal.db.v2";

export function loadDatabase(): Database {
  if (typeof window === "undefined") return createSeedDatabase();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedDatabase();
    const parsed = JSON.parse(raw) as Database;
    if (!parsed?.athletes?.length || !parsed?.colleges) return createSeedDatabase();
    return parsed;
  } catch {
    return createSeedDatabase();
  }
}

export function saveDatabase(db: Database) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage unavailable — demo keeps running in memory */
  }
}

export function clearDatabase() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export const SESSION_KEY = "khelolocal.session.v1";

export function loadSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function saveSession(userId: string | null) {
  if (typeof window === "undefined") return;
  if (userId) window.localStorage.setItem(SESSION_KEY, userId);
  else window.localStorage.removeItem(SESSION_KEY);
}