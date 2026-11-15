import type { Database } from "@/types";
import { createSeedDatabase } from "@/data/seed";

/**
 * Demo data adapter.
 *
 * All reads/writes in the app go through the store which calls into this
 * adapter. Swapping this file for Firestore (collection reads + a transaction
 * inside `verifyMatch`) does not require any UI change.
 */
export const STORAGE_KEY = "khelolocal.db.v3";

export function loadDatabase(): Database {
  if (typeof window === "undefined") return createSeedDatabase();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedDatabase();
    const parsed = JSON.parse(raw) as Database;
    if (!parsed?.athletes?.length || !parsed?.colleges || !parsed?.zones)
      return createSeedDatabase();
    parsed.profileFollows ??= [];
    parsed.profileConnectionRequests ??= (parsed.connections ?? [])
      .filter((connection) => connection.status === "SENT")
      .flatMap((connection) => {
        const requester = parsed.users.find(
          (user) => user.id === connection.scoutUserId || user.id === connection.scoutUserId,
        );
        const athlete = parsed.athletes.find((item) => item.id === connection.athleteId);
        if (!requester || !athlete) return [];
        return [
          {
            id: connection.id,
            requesterProfileId: requester.id,
            recipientProfileId: athlete.userId,
            status: "PENDING" as const,
            introductionNote: "",
            createdAt: connection.createdAt,
            respondedAt: null,
            updatedAt: connection.createdAt,
          },
        ];
      });
    parsed.profileConnections ??= [];
    parsed.profileBlocks ??= [];
    parsed.savedProfiles ??= (parsed.savedAthletes ?? []).flatMap((athleteId) => {
      const athlete = parsed.athletes.find((item) => item.id === athleteId);
      return athlete
        ? [{ profileId: "u_scout", targetProfileId: athlete.userId, createdAt: new Date().toISOString() }]
        : [];
    });
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
