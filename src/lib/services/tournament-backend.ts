import type {
  Match,
  PlayerPerformance,
  Registration,
  RegistrationStatus,
  Tournament,
  TournamentStatus,
} from "@/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database as SupabaseDatabase, Json } from "@/integrations/supabase/types";

const report = (operation: string, error: unknown) =>
  console.warn(`Could not persist ${operation}:`, error);

type RegistrationRow = SupabaseDatabase["public"]["Tables"]["tournament_registrations"]["Row"];
type TournamentRow = SupabaseDatabase["public"]["Tables"]["tournament_domain"]["Row"];

const publicTournamentStatuses: TournamentStatus[] = [
  "UPCOMING",
  "REGISTRATION_OPEN",
  "LIVE",
  "COMPLETED",
  "CANCELLED",
];

export interface TournamentSearch {
  sportId?: string;
  cityName?: string;
  ageCategory?: string;
  genderCategory?: string;
  status?: string;
  fromDate?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface TournamentPage {
  tournaments: Tournament[];
  total: number;
}

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

function isJsonObject(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTournament(row: TournamentRow): Tournament | null {
  if (!isJsonObject(row.payload)) return null;

  const payload = row.payload;
  const value = (key: string) => payload[key];
  const stringValue = (key: string, fallback = "") => {
    const item = value(key);
    return typeof item === "string" ? item : fallback;
  };
  const numberValue = (key: string, fallback = 0) => {
    const item = value(key);
    return typeof item === "number" && Number.isFinite(item) ? item : fallback;
  };
  const status = stringValue("status");
  if (
    status !== "DRAFT" &&
    status !== "UPCOMING" &&
    status !== "REGISTRATION_OPEN" &&
    status !== "LIVE" &&
    status !== "COMPLETED" &&
    status !== "CANCELLED"
  ) {
    return null;
  }

  const verified = value("adminVerified");
  return {
    id: row.id,
    name: stringValue("name", "Tournament"),
    sportId: stringValue("sportId"),
    sportName: stringValue("sportName"),
    organizerId: row.organizer_profile_id,
    organizerName: stringValue("organizerName"),
    cityId: stringValue("cityId"),
    cityName: stringValue("cityName"),
    venue: stringValue("venue"),
    address: stringValue("address"),
    startDate: stringValue("startDate"),
    endDate: stringValue("endDate"),
    registrationDeadline: stringValue("registrationDeadline"),
    ageCategory: stringValue("ageCategory", "OPEN"),
    genderCategory: stringValue("genderCategory", "MIXED"),
    format: stringValue("format"),
    maxParticipants: numberValue("maxParticipants"),
    currentParticipants: numberValue("currentParticipants"),
    registrationFee: numberValue("registrationFee"),
    prizePool: numberValue("prizePool"),
    description: stringValue("description"),
    status,
    bannerImage: stringValue("bannerImage"),
    ...(typeof verified === "boolean" ? { adminVerified: verified } : {}),
    createdAt: stringValue("createdAt", row.created_at),
    updatedAt: stringValue("updatedAt", row.updated_at),
  };
}

export async function searchTournamentPage(filters: TournamentSearch): Promise<TournamentPage> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const pageSize = Math.min(Math.max(Math.trunc(filters.pageSize ?? 12), 1), 100);
  const page = Math.max(Math.trunc(filters.page ?? 0), 0);
  let request = supabase
    .from("tournament_domain")
    .select("id, organizer_profile_id, payload, created_at, updated_at", { count: "exact" })
    .in("payload->>status", publicTournamentStatuses);

  if (filters.sportId) request = request.eq("payload->>sportId", filters.sportId);
  if (filters.cityName) request = request.eq("payload->>cityName", filters.cityName);
  if (filters.ageCategory) request = request.eq("payload->>ageCategory", filters.ageCategory);
  if (filters.genderCategory)
    request = request.eq("payload->>genderCategory", filters.genderCategory);
  if (filters.status) request = request.eq("payload->>status", filters.status);
  if (filters.fromDate) request = request.gte("payload->>startDate", filters.fromDate);
  if (filters.query?.trim()) request = request.ilike("payload->>name", `%${filters.query.trim()}%`);

  const { data, error, count } = await request
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);
  if (error) throw new Error(error.message);

  return {
    tournaments: (data ?? []).flatMap((row) => {
      const tournament = parseTournament(row);
      return tournament ? [tournament] : [];
    }),
    total: count ?? 0,
  };
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("tournament_domain")
    .select("id, organizer_profile_id, payload, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? parseTournament(data) : null;
}

export interface AthleteTournamentRegistrations {
  registrations: Registration[];
  tournaments: Tournament[];
}

export async function getAthleteTournamentRegistrations(): Promise<AthleteTournamentRegistrations> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("tournament_registrations")
    .select("*")
    .order("registration_date", { ascending: false });
  if (error) throw new Error(error.message);

  const registrations = (data ?? []).map(toRegistration);
  const tournamentIds = [
    ...new Set(registrations.map((registration) => registration.tournamentId)),
  ];
  if (tournamentIds.length === 0) return { registrations, tournaments: [] };

  const { data: tournamentRows, error: tournamentsError } = await supabase
    .from("tournament_domain")
    .select("id, organizer_profile_id, payload, created_at, updated_at")
    .in("id", tournamentIds);
  if (tournamentsError) throw new Error(tournamentsError.message);

  return {
    registrations,
    tournaments: (tournamentRows ?? []).flatMap((row) => {
      const tournament = parseTournament(row);
      return tournament ? [tournament] : [];
    }),
  };
}

export async function getAthleteRegistration(
  tournamentId: string,
  athleteId: string,
): Promise<Registration | null> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("tournament_registrations")
    .select("*")
    .eq("tournament_id", tournamentId)
    .eq("athlete_profile_id", athleteId)
    .in("status", ["PENDING", "APPROVED"])
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toRegistration(data) : null;
}

export async function getTournamentRegistrations(tournamentId: string): Promise<Registration[]> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("tournament_registrations")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("registration_date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toRegistration);
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
