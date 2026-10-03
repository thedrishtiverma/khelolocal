import type { Match, PlayerPerformance, Registration, Tournament } from "@/types";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

const report = (operation: string, error: unknown) =>
  console.warn(`Could not persist ${operation}:`, error);

export function persistTournament(tournament: Tournament, organizerProfileId: string) {
  if (!isSupabaseConfigured()) return;
  void (supabase as any)
    .from("tournament_domain")
    .upsert({ id: tournament.id, organizer_profile_id: organizerProfileId, payload: tournament })
    .then(({ error }: { error?: { message: string } }) => error && report("tournament", error.message));
}

export function persistRegistration(registration: Registration) {
  if (!isSupabaseConfigured()) return;
  void (supabase as any)
    .from("tournament_registrations")
    .upsert({
      id: registration.id,
      tournament_id: registration.tournamentId,
      athlete_profile_id: registration.athleteId,
      team_id: registration.teamId,
      status: registration.status,
      registration_date: registration.registrationDate,
    })
    .then(({ error }: { error?: { message: string } }) => error && report("registration", error.message));
}

export function persistMatchResult(
  match: Match,
  organizerProfileId: string,
  performances: PlayerPerformance[],
) {
  if (!isSupabaseConfigured()) return;
  void (async () => {
    const { error } = await (supabase as any)
      .from("match_results")
      .upsert({ id: match.id, tournament_id: match.tournamentId, organizer_profile_id: organizerProfileId, payload: match });
    if (error) return report("match result", error.message);
    const rows = performances.map((performance) => ({
      id: performance.id,
      match_id: match.id,
      athlete_profile_id: performance.athleteId,
      payload: performance,
    }));
    if (!rows.length) return;
    const { error: performanceError } = await (supabase as any).from("match_performances").upsert(rows);
    if (performanceError) report("match performances", performanceError.message);
  })();
}
