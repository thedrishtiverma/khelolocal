import type {
  Match,
  PlayerPerformance,
  Registration,
  RegistrationStatus,
  Tournament,
} from "@/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database as SupabaseDatabase, Json } from "@/integrations/supabase/types";

const report = (operation: string, error: unknown) =>
  console.warn(`Could not persist ${operation}:`, error);

type RegistrationRow = SupabaseDatabase["public"]["Tables"]["tournament_registrations"]["Row"];

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

export function persistTournament(tournament: Tournament, organizerProfileId: string) {
  if (!isSupabaseConfigured()) return;
  void supabase
    .from("tournament_domain")
    .upsert({
      id: tournament.id,
      organizer_profile_id: organizerProfileId,
      payload: toJson(tournament),
    })
    .then(({ error }) => error && report("tournament", error.message));
}

function toRegistration(row: RegistrationRow): Registration {
  const status = row.status;
  if (
    status !== "PENDING" &&
    status !== "APPROVED" &&
    status !== "REJECTED" &&
    status !== "WITHDRAWN"
  ) {
    throw new Error("Supabase returned an invalid registration status");
  }

  return {
    id: row.id,
    tournamentId: row.tournament_id,
    athleteId: row.athlete_profile_id,
    teamId: row.team_id,
    status: status as RegistrationStatus,
    registrationDate: row.registration_date,
    paymentStatus: "NOT_REQUIRED",
    seedNumber: null,
  };
}

export async function registerForTournament(tournamentId: string): Promise<Registration> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.rpc("register_for_tournament", {
    p_tournament_id: tournamentId,
    p_team_id: null,
  });
  if (error) throw new Error(error.message);
  if (!data || typeof data !== "object") {
    throw new Error("Registration was not returned by the database");
  }
  return toRegistration(data);
}

export async function reviewTournamentRegistration(
  registrationId: string,
  status: Extract<RegistrationStatus, "APPROVED" | "REJECTED">,
): Promise<Registration> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.rpc("review_tournament_registration", {
    p_registration_id: registrationId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  if (!data || typeof data !== "object") {
    throw new Error("Registration update was not returned by the database");
  }
  return toRegistration(data);
}

export function persistMatchResult(
  match: Match,
  organizerProfileId: string,
  performances: PlayerPerformance[],
) {
  if (!isSupabaseConfigured()) return;
  void (async () => {
    const { error } = await supabase.from("match_results").upsert({
      id: match.id,
      tournament_id: match.tournamentId,
      organizer_profile_id: organizerProfileId,
      payload: toJson(match),
    });
    if (error) return report("match result", error.message);
    const rows = performances.map((performance) => ({
      id: performance.id,
      match_id: match.id,
      athlete_profile_id: performance.athleteId,
      payload: toJson(performance),
    }));
    if (!rows.length) return;
    const { error: performanceError } = await supabase.from("match_performances").upsert(rows);
    if (performanceError) report("match performances", performanceError.message);
  })();
}
