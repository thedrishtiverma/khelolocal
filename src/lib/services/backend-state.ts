import type { Database } from "@/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

function toJson(value: unknown): Json {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) return value.map(toJson);
  if (typeof value === "object") {
    const result: { [key: string]: Json | undefined } = {};
    for (const [key, item] of Object.entries(value)) {
      if (item !== undefined) result[key] = toJson(item);
    }
    return result;
  }
  throw new Error("Supabase JSON payload contains an unsupported value");
}

function isDatabase(value: unknown): value is Database {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Database>;
  return (
    Array.isArray(data.athletes) && Array.isArray(data.tournaments) && Array.isArray(data.matches)
  );
}

export async function loadOperationalState(): Promise<{ db: Database; version: number } | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("operational_state")
    .select("payload, version")
    .eq("id", "primary")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data && isDatabase(data.payload) ? { db: data.payload, version: data.version } : null;
}

export async function saveOperationalState(db: Database, version: number | null): Promise<number> {
  if (!isSupabaseConfigured()) return version ?? 0;
  const { data, error } = await supabase.rpc("save_operational_state", {
    next_payload: toJson(db),
    expected_version: version,
  });
  if (error) throw new Error(error.message);
  return data[0]?.version ?? version ?? 0;
}
