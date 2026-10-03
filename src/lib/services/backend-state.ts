import type { Database } from "@/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

type StateRow = { payload: unknown; version: number };

function isDatabase(value: unknown): value is Database {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Database>;
  return Array.isArray(data.athletes) && Array.isArray(data.tournaments) && Array.isArray(data.matches);
}

export async function loadOperationalState(): Promise<{ db: Database; version: number } | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await (supabase as any)
    .from("operational_state")
    .select("payload, version")
    .eq("id", "primary")
    .maybeSingle();
  if (error) throw new Error(error.message);
  const row = data as StateRow | null;
  return row && isDatabase(row.payload) ? { db: row.payload, version: row.version } : null;
}

export async function saveOperationalState(db: Database, version: number | null): Promise<number> {
  if (!isSupabaseConfigured()) return version ?? 0;
  const { data, error } = await (supabase as any).rpc("save_operational_state", {
    next_payload: db,
    expected_version: version,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  return Number(row?.version ?? version ?? 0);
}
