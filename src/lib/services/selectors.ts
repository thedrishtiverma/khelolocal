import type { Athlete, CollegeRecord, Database, Match, Tournament } from "@/types";

export function athleteById(db: Database, id: string) {
  return db.athletes.find((a) => a.id === id);
}
export function athleteByUserId(db: Database, userId: string) {
  return db.athletes.find((a) => a.userId === userId);
}
export function organizerByUserId(db: Database, userId: string) {
  return db.organizers.find((o) => o.userId === userId);
}
export function collegeByUserId(db: Database, userId: string) {
  return db.colleges.find((c) => c.userId === userId);
}
export function athletesOfCollege(db: Database, collegeId: string) {
  return db.athletes.filter((a) => a.collegeId === collegeId);
}
export function recordsOfCollege(db: Database, collegeId: string): CollegeRecord[] {
  return db.collegeRecords
    .filter((r) => r.collegeId === collegeId)
    .sort((a, b) => (a.season < b.season ? 1 : -1));
}
export function recordsOfAthlete(db: Database, athleteId: string): CollegeRecord[] {
  return db.collegeRecords
    .filter((r) => r.athleteId === athleteId)
    .sort((a, b) => (a.season < b.season ? 1 : -1));
}
export function publicRecordsOfAthlete(db: Database, athleteId: string): CollegeRecord[] {
  return recordsOfAthlete(db, athleteId).filter((r) => r.status === "ADMIN_VERIFIED");
}
export function pendingCollegeRecords(db: Database, collegeId: string) {
  return recordsOfCollege(db, collegeId).filter((r) => r.status === "SUBMITTED");
}
export function pendingAdminRecords(db: Database) {
  return db.collegeRecords.filter((r) => r.status === "COLLEGE_VERIFIED");
}
export function tournamentById(db: Database, id: string) {
  return db.tournaments.find((t) => t.id === id);
}
export function teamById(db: Database, id: string) {
  return db.teams.find((t) => t.id === id);
}
export function matchById(db: Database, id: string) {
  return db.matches.find((m) => m.id === id);
}
export function matchesOfTournament(db: Database, tournamentId: string) {
  return db.matches
    .filter((m) => m.tournamentId === tournamentId)
    .sort((a, b) => a.matchNumber - b.matchNumber);
}
export function registrationsOfTournament(db: Database, tournamentId: string) {
  return db.registrations.filter((r) => r.tournamentId === tournamentId);
}
export function achievementsOfAthlete(db: Database, athleteId: string) {
  return db.achievements
    .filter((a) => a.athleteId === athleteId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
export function tournamentsOfAthlete(db: Database, athleteId: string) {
  const ids = db.registrations.filter((r) => r.athleteId === athleteId).map((r) => r.tournamentId);
  return db.tournaments.filter((t) => ids.includes(t.id));
}
export function performancesOfMatch(db: Database, matchId: string) {
  return db.playerPerformances.filter((p) => p.matchId === matchId);
}
export function teamRoster(db: Database, teamId: string): Athlete[] {
  const team = teamById(db, teamId);
  if (!team) return [];
  return team.players.map((id) => athleteById(db, id)).filter((a): a is Athlete => Boolean(a));
}

export interface TournamentFilters {
  sportId?: string;
  cityId?: string;
  ageCategory?: string;
  genderCategory?: string;
  status?: string;
  fromDate?: string;
  query?: string;
}

export function searchTournaments(db: Database, f: TournamentFilters): Tournament[] {
  return db.tournaments
    .filter((t) => t.status !== "DRAFT")
    .filter((t) => (f.sportId ? t.sportId === f.sportId : true))
    .filter((t) => (f.cityId ? t.cityId === f.cityId : true))
    .filter((t) => (f.ageCategory ? t.ageCategory === f.ageCategory : true))
    .filter((t) => (f.genderCategory ? t.genderCategory === f.genderCategory : true))
    .filter((t) => (f.status ? t.status === f.status : true))
    .filter((t) => (f.fromDate ? t.endDate >= f.fromDate : true))
    .filter((t) => (f.query ? t.name.toLowerCase().includes(f.query.toLowerCase().trim()) : true))
    .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
}

export interface AthleteFilters {
  sportId?: string;
  cityId?: string;
  ageCategory?: string;
  positionGroup?: string;
  minVerifiedTournaments?: number;
  collegeId?: string;
  hasCollegeRecords?: boolean;
  query?: string;
}

export function searchAthletes(db: Database, f: AthleteFilters): Athlete[] {
  return db.athletes
    .filter((a) => (f.sportId ? a.primarySport === f.sportId : true))
    .filter((a) => (f.cityId ? a.cityId === f.cityId : true))
    .filter((a) => (f.ageCategory ? a.ageCategory === f.ageCategory : true))
    .filter((a) => (f.positionGroup ? a.positionGroup === f.positionGroup : true))
    .filter((a) => (f.collegeId ? a.collegeId === f.collegeId : true))
    .filter((a) => (f.hasCollegeRecords ? publicRecordsOfAthlete(db, a.id).length > 0 : true))
    .filter((a) =>
      f.minVerifiedTournaments ? a.tournamentsPlayed >= f.minVerifiedTournaments : true,
    )
    .filter((a) => (f.query ? a.name.toLowerCase().includes(f.query.toLowerCase().trim()) : true))
    .sort((a, b) => b.verifiedAchievementsCount - a.verifiedAchievementsCount);
}

export function matchLabel(db: Database, match: Match) {
  return `${teamById(db, match.teamAId)?.name ?? "TBD"} vs ${teamById(db, match.teamBId)?.name ?? "TBD"}`;
}
