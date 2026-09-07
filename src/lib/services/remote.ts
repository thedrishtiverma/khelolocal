import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types";

/**
 * Cloud data adapter.
 *
 * The app keeps working against one in-memory `Database` object; this module
 * loads it from the shared cloud database and pushes back whatever changed.
 * That keeps every existing store action untouched while making all data
 * visible to every user of the app instead of one browser.
 */

type Collection = Exclude<keyof Database, "savedAthletes">;

export const TABLES: Record<Collection, string> = {
  users: "app_users",
  zones: "zones",
  volunteers: "volunteers",
  fieldSubmissions: "field_submissions",
  athletes: "athletes",
  organizers: "organizers",
  colleges: "colleges",
  collegeRecords: "college_records",
  sports: "sports",
  cities: "cities",
  tournaments: "tournaments",
  registrations: "registrations",
  teams: "teams",
  matches: "matches",
  playerPerformances: "player_performances",
  verifications: "verifications",
  achievements: "achievements",
  connections: "connections",
};

const COLLECTIONS = Object.keys(TABLES) as Collection[];

/** Columns that exist only in the database and never in the app model. */
const INTERNAL = new Set(["updated_at_db", "auth_user_id"]);

const toSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

function rowToRecord(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (INTERNAL.has(k)) continue;
    out[toCamel(k)] = v;
  }
  return out;
}

function recordToRow(record: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(record)) {
    if (v === undefined) continue;
    out[toSnake(k)] = v;
  }
  return out;
}

const anyClient = supabase as unknown as {
  from: (table: string) => any;
};

/** Reads every collection. Tables the visitor may not read come back empty. */
export async function fetchRemoteDatabase(authUserId: string | null): Promise<Partial<Database>> {
  const result: Partial<Database> = {};
  await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const { data, error } = await anyClient.from(TABLES[collection]).select("*").limit(2000);
      if (error || !data) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[collection] = (data as Record<string, unknown>[]).map(rowToRecord);
    }),
  );

  if (authUserId) {
    const { data } = await anyClient
      .from("saved_athletes")
      .select("athlete_id")
      .eq("user_id", authUserId);
    result.savedAthletes = ((data ?? []) as { athlete_id: string }[]).map((r) => r.athlete_id);
  } else {
    result.savedAthletes = [];
  }
  return result;
}

interface Identified {
  id: string;
}

/** Writes only the rows that were added or changed, and deletes removed rows. */
export async function pushRemoteChanges(
  prev: Database,
  next: Database,
  appUserId: string | null,
): Promise<void> {
  const jobs: Promise<unknown>[] = [];

  for (const collection of COLLECTIONS) {
    const table = TABLES[collection];
    const before = (prev[collection] ?? []) as unknown as Identified[];
    const after = (next[collection] ?? []) as unknown as Identified[];
    const beforeMap = new Map(before.map((r) => [r.id, JSON.stringify(r)]));
    const afterIds = new Set(after.map((r) => r.id));

    const changed = after.filter((row) => beforeMap.get(row.id) !== JSON.stringify(row));
    if (changed.length) {
      jobs.push(
        anyClient
          .from(table)
          .upsert(changed.map((row) => recordToRow(row as unknown as Record<string, unknown>)), {
            onConflict: "id",
          }),
      );
    }

    const removed = before.filter((row) => !afterIds.has(row.id)).map((row) => row.id);
    if (removed.length) jobs.push(anyClient.from(table).delete().in("id", removed));
  }

  if (appUserId) {
    const beforeSaved = new Set(prev.savedAthletes ?? []);
    const afterSaved = new Set(next.savedAthletes ?? []);
    const added = [...afterSaved].filter((id) => !beforeSaved.has(id));
    const dropped = [...beforeSaved].filter((id) => !afterSaved.has(id));
    if (added.length)
      jobs.push(
        anyClient
          .from("saved_athletes")
          .upsert(
            added.map((athleteId) => ({ user_id: appUserId, athlete_id: athleteId })),
            { onConflict: "user_id,athlete_id" },
          ),
      );
    if (dropped.length)
      jobs.push(
        anyClient
          .from("saved_athletes")
          .delete()
          .eq("user_id", appUserId)
          .in("athlete_id", dropped),
      );
  }

  await Promise.all(jobs);
}
