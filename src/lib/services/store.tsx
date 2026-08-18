import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  Achievement,
  CollegeRecord,
  Database,
  Match,
  PlayerPerformance,
  Role,
  SelectionLevel,
  Tournament,
  User,
} from "@/types";
import { createSeedDatabase } from "@/data/seed";
import {
  clearDatabase,
  loadDatabase,
  loadSession,
  saveDatabase,
  saveSession,
} from "./db";
import { athleteById, matchById, tournamentById } from "./selectors";

const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export interface PerformanceDraft {
  athleteId: string;
  teamId: string;
  goals: number;
  assists: number;
  playerOfMatch: boolean;
  raidPoints?: number;
  tacklePoints?: number;
}

export interface VerifyOutcome {
  matchId: string;
  achievements: Achievement[];
  updatedAthletes: { name: string; before: string; after: string }[];
}

interface StoreValue {
  db: Database;
  hydrated: boolean;
  currentUser: User | null;
  login: (email: string) => User | null;
  logout: () => void;
  signup: (input: { name: string; email: string; role: Role }) => User;
  createTournament: (input: Partial<Tournament>) => Tournament;
  register: (tournamentId: string, athleteId: string) => void;
  setRegistrationStatus: (registrationId: string, status: "APPROVED" | "REJECTED") => void;
  generateFixtures: (tournamentId: string) => number;
  saveMatch: (matchId: string, scores: { teamAScore: number; teamBScore: number }, performances: PerformanceDraft[]) => void;
  finishMatch: (matchId: string, scores: { teamAScore: number; teamBScore: number }, performances: PerformanceDraft[]) => void;
  verifyMatch: (matchId: string, note?: string) => VerifyOutcome | null;
  toggleSaveAthlete: (athleteId: string) => void;
  requestConnection: (athleteId: string) => void;
  submitCollegeRecord: (input: {
    athleteId: string;
    sportId: string;
    eventName: string;
    season: string;
    level: SelectionLevel;
    title: string;
    description: string;
    representedFor: string;
    /** Set when the submitter is the college itself — skips straight to college-verified. */
    autoCollegeVerify?: boolean;
  }) => CollegeRecord | null;
  collegeReviewRecord: (recordId: string, approve: boolean) => void;
  adminReviewRecord: (recordId: string, approve: boolean) => void;
  adminSetTournamentVerified: (tournamentId: string, verified: boolean) => void;
  adminSetAthleteVerification: (athleteId: string, status: "VERIFIED" | "PENDING") => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function KheloProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database>(() => createSeedDatabase());
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDb(loadDatabase());
    setUserId(loadSession());
    setHydrated(true);
  }, []);

  const commit = useCallback((updater: (draft: Database) => void) => {
    setDb((prev) => {
      const next = structuredClone(prev) as Database;
      updater(next);
      saveDatabase(next);
      return next;
    });
  }, []);

  const currentUser = useMemo(
    () => db.users.find((u) => u.id === userId) ?? null,
    [db.users, userId],
  );

  const login: StoreValue["login"] = useCallback(
    (email) => {
      const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) return null;
      setUserId(user.id);
      saveSession(user.id);
      return user;
    },
    [db.users],
  );

  const logout = useCallback(() => {
    setUserId(null);
    saveSession(null);
  }, []);

  const signup: StoreValue["signup"] = useCallback(
    ({ name, email, role }) => {
      const id = uid("u");
      const user: User = {
        id,
        name,
        email,
        phone: "",
        role,
        cityId: "indore",
        profileImage: "",
        createdAt: now(),
        updatedAt: now(),
        isActive: true,
      };
      commit((draft) => {
        draft.users.push(user);
        if (role === "ATHLETE") {
          draft.athletes.push({
            id: uid("ath"),
            userId: id,
            name,
            profileImage: "",
            cityId: "indore",
            cityName: "Indore",
            dateOfBirth: "",
            gender: "MALE",
            primarySport: "football",
            secondarySports: [],
            position: "",
            positionGroup: "FORWARD",
            ageCategory: "OPEN",
            skills: [],
            bio: "",
            verificationStatus: "UNVERIFIED",
            tournamentsPlayed: 0,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            goals: 0,
            verifiedAchievementsCount: 0,
            createdAt: now(),
            updatedAt: now(),
          });
        }
        if (role === "ORGANIZER") {
          draft.organizers.push({
            id: uid("org"),
            userId: id,
            organizationName: name,
            organizationType: "Club",
            cityId: "indore",
            cityName: "Indore",
            description: "",
            logo: "",
            phone: "",
            email,
            verificationStatus: "PENDING",
            tournamentsHosted: 0,
            createdAt: now(),
            updatedAt: now(),
          });
        }
        if (role === "COLLEGE") {
          draft.colleges.push({
            id: uid("clg"),
            userId: id,
            name,
            shortName: name,
            cityId: "indore",
            cityName: "Indore",
            sportsEventName: "Annual Sports Event",
            description: "",
            verificationStatus: "PENDING",
            createdAt: now(),
            updatedAt: now(),
          });
        }
      });
      setUserId(id);
      saveSession(id);
      return user;
    },
    [commit],
  );

  const createTournament: StoreValue["createTournament"] = useCallback(
    (input) => {
      const organizer = db.organizers.find((o) => o.userId === userId) ?? db.organizers[0];
      if (!organizer) throw new Error("No organizer profile available");
      const tournament: Tournament = {
        id: uid("trn"),
        name: "Untitled tournament",
        sportId: "football",
        sportName: "Football",
        organizerId: organizer.id,
        organizerName: organizer.organizationName,
        cityId: "indore",
        cityName: "Indore",
        venue: "",
        address: "",
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        ageCategory: "OPEN",
        genderCategory: "MIXED",
        format: "Knockout",
        maxParticipants: 16,
        currentParticipants: 0,
        registrationFee: 0,
        prizePool: 0,
        description: "",
        status: "REGISTRATION_OPEN",
        bannerImage: "",
        createdAt: now(),
        updatedAt: now(),
        ...input,
      } as Tournament;
      commit((draft) => {
        draft.tournaments.push(tournament);
        const org = draft.organizers.find((o) => o.id === tournament.organizerId);
        if (org) org.tournamentsHosted += 1;
      });
      return tournament;
    },
    [commit, db.organizers, userId],
  );

  const register: StoreValue["register"] = useCallback(
    (tournamentId, athleteId) => {
      commit((draft) => {
        if (draft.registrations.some((r) => r.tournamentId === tournamentId && r.athleteId === athleteId))
          return;
        draft.registrations.push({
          id: uid("reg"),
          tournamentId,
          athleteId,
          teamId: null,
          registrationDate: now(),
          status: "PENDING",
          paymentStatus: "NOT_REQUIRED",
          seedNumber: null,
        });
      });
    },
    [commit],
  );

  const setRegistrationStatus: StoreValue["setRegistrationStatus"] = useCallback(
    (registrationId, status) => {
      commit((draft) => {
        const reg = draft.registrations.find((r) => r.id === registrationId);
        if (!reg) return;
        const wasApproved = reg.status === "APPROVED";
        reg.status = status;
        const tournament = draft.tournaments.find((t) => t.id === reg.tournamentId);
        if (tournament) {
          if (status === "APPROVED" && !wasApproved) tournament.currentParticipants += 1;
          if (status === "REJECTED" && wasApproved)
            tournament.currentParticipants = Math.max(0, tournament.currentParticipants - 1);
        }
      });
    },
    [commit],
  );

  /** Simple deterministic pairing of approved teams, in registration order. */
  const generateFixtures: StoreValue["generateFixtures"] = useCallback(
    (tournamentId) => {
      let created = 0;
      commit((draft) => {
        const teamIds: string[] = [];
        draft.registrations
          .filter((r) => r.tournamentId === tournamentId && r.status === "APPROVED" && r.teamId)
          .forEach((r) => {
            if (r.teamId && !teamIds.includes(r.teamId)) teamIds.push(r.teamId);
          });
        const existing = draft.matches.filter((m) => m.tournamentId === tournamentId);
        let matchNumber = existing.length;
        for (let i = 0; i + 1 < teamIds.length; i += 2) {
          const a = teamIds[i]!;
          const b = teamIds[i + 1]!;
          const already = existing.some(
            (m) =>
              (m.teamAId === a && m.teamBId === b) || (m.teamAId === b && m.teamBId === a),
          );
          if (already) continue;
          matchNumber += 1;
          created += 1;
          draft.matches.push({
            id: uid("mat"),
            tournamentId,
            round: "Group Stage",
            matchNumber,
            teamAId: a,
            teamBId: b,
            teamAScore: 0,
            teamBScore: 0,
            scheduledAt: now(),
            venue: draft.tournaments.find((t) => t.id === tournamentId)?.venue ?? "",
            status: "SCHEDULED",
            winnerId: null,
            resultStatus: "PENDING",
            createdAt: now(),
            updatedAt: now(),
          });
        }
      });
      return created;
    },
    [commit],
  );

  const writeMatch = useCallback(
    (
      matchId: string,
      scores: { teamAScore: number; teamBScore: number },
      performances: PerformanceDraft[],
      finish: boolean,
    ) => {
      commit((draft) => {
        const match = draft.matches.find((m) => m.id === matchId);
        if (!match) return;
        match.teamAScore = scores.teamAScore;
        match.teamBScore = scores.teamBScore;
        match.status = finish ? "COMPLETED" : "LIVE";
        match.resultStatus = "PENDING";
        match.winnerId =
          scores.teamAScore === scores.teamBScore
            ? null
            : scores.teamAScore > scores.teamBScore
              ? match.teamAId
              : match.teamBId;
        match.updatedAt = now();

        draft.playerPerformances = draft.playerPerformances.filter((p) => p.matchId !== matchId);
        performances
          .filter((p) => p.goals || p.assists || p.playerOfMatch || p.raidPoints || p.tacklePoints)
          .forEach((p) => {
            const perf: PlayerPerformance = {
              id: uid("perf"),
              matchId,
              tournamentId: match.tournamentId,
              athleteId: p.athleteId,
              teamId: p.teamId,
              goals: p.goals,
              assists: p.assists,
              points: p.goals * 2 + p.assists,
              playerOfMatch: p.playerOfMatch,
              performanceNotes: "",
              verified: false,
              ...(p.raidPoints === undefined ? {} : { raidPoints: p.raidPoints }),
              ...(p.tacklePoints === undefined ? {} : { tacklePoints: p.tacklePoints }),
              createdAt: now(),
            };
            draft.playerPerformances.push(perf);
          });
      });
    },
    [commit],
  );

  const saveMatch: StoreValue["saveMatch"] = useCallback(
    (matchId, scores, performances) => writeMatch(matchId, scores, performances, false),
    [writeMatch],
  );
  const finishMatch: StoreValue["finishMatch"] = useCallback(
    (matchId, scores, performances) => writeMatch(matchId, scores, performances, true),
    [writeMatch],
  );

  /**
   * The core loop: verified result -> athlete records -> achievements.
   * Only the organizer that owns the tournament may verify.
   */
  const verifyMatch: StoreValue["verifyMatch"] = useCallback(
    (matchId, note = "") => {
      const match = matchById(db, matchId);
      const tournament = match ? tournamentById(db, match.tournamentId) : undefined;
      const organizer = db.organizers.find((o) => o.userId === userId);
      if (!match || !tournament || !organizer || organizer.id !== tournament.organizerId) return null;
      if (match.resultStatus === "VERIFIED") return null;

      const created: Achievement[] = [];
      const updated: VerifyOutcome["updatedAthletes"] = [];

      commit((draft) => {
        const m = draft.matches.find((x) => x.id === matchId)!;
        m.status = "COMPLETED";
        m.resultStatus = "VERIFIED";
        m.updatedAt = now();

        draft.verifications.push({
          id: uid("ver"),
          matchId,
          tournamentId: m.tournamentId,
          organizerId: organizer.id,
          status: "VERIFIED",
          verifiedAt: now(),
          verificationNote: note,
        });

        const perfs = draft.playerPerformances.filter((p) => p.matchId === matchId);
        const rosterIds = new Set<string>();
        [m.teamAId, m.teamBId].forEach((teamId) => {
          draft.teams.find((t) => t.id === teamId)?.players.forEach((p) => rosterIds.add(p));
        });
        perfs.forEach((p) => rosterIds.add(p.athleteId));

        rosterIds.forEach((athleteId) => {
          const athlete = draft.athletes.find((a) => a.id === athleteId);
          if (!athlete) return;
          const perf = perfs.find((p) => p.athleteId === athleteId);
          const teamId =
            perf?.teamId ??
            (draft.teams.find((t) => t.id === m.teamAId)?.players.includes(athleteId)
              ? m.teamAId
              : m.teamBId);
          // Only players with a recorded performance count as having played.
          if (!perf) return;
          const before = `${athlete.matchesPlayed} matches · ${athlete.wins} wins · ${athlete.goals} goals · ${athlete.verifiedAchievementsCount} verified`;

          perf.verified = true;
          athlete.matchesPlayed += 1;
          if (m.winnerId && m.winnerId === teamId) athlete.wins += 1;
          else if (m.winnerId) athlete.losses += 1;
          athlete.goals += perf.goals;
          athlete.verificationStatus = "VERIFIED";

          const alreadyCountedTournament = draft.registrations.some(
            (r) => r.athleteId === athleteId && r.tournamentId === m.tournamentId,
          );
          if (!alreadyCountedTournament) athlete.tournamentsPlayed += 1;

          const push = (
            title: string,
            description: string,
            achievementType: Achievement["achievementType"],
          ) => {
            const ach: Achievement = {
              id: uid("ach"),
              athleteId,
              tournamentId: m.tournamentId,
              matchId,
              title,
              description,
              achievementType,
              verified: true,
              verifiedBy: organizer.organizationName,
              date: now().slice(0, 10),
              createdAt: now(),
            };
            draft.achievements.push(ach);
            created.push(ach);
            athlete.verifiedAchievementsCount += 1;
          };

          if (perf.playerOfMatch) {
            push(
              "Player of the Match",
              `${tournament.name} — ${m.round}${perf.goals ? `, ${perf.goals} goal${perf.goals > 1 ? "s" : ""}` : ""}.`,
              "PLAYER_OF_MATCH",
            );
          } else if (perf.goals >= 3) {
            push("Hat-trick", `${perf.goals} goals in ${tournament.name}.`, "MATCH_PERFORMANCE");
          }

          athlete.updatedAt = now();
          updated.push({
            name: athlete.name,
            before,
            after: `${athlete.matchesPlayed} matches · ${athlete.wins} wins · ${athlete.goals} goals · ${athlete.verifiedAchievementsCount} verified`,
          });
        });
      });

      return { matchId, achievements: created, updatedAthletes: updated };
    },
    [commit, db, userId],
  );

  const toggleSaveAthlete: StoreValue["toggleSaveAthlete"] = useCallback(
    (athleteId) => {
      commit((draft) => {
        draft.savedAthletes = draft.savedAthletes.includes(athleteId)
          ? draft.savedAthletes.filter((id) => id !== athleteId)
          : [...draft.savedAthletes, athleteId];
      });
    },
    [commit],
  );

  const requestConnection: StoreValue["requestConnection"] = useCallback(
    (athleteId) => {
      commit((draft) => {
        if (draft.connections.some((c) => c.athleteId === athleteId && c.scoutUserId === userId))
          return;
        draft.connections.push({
          id: uid("con"),
          scoutUserId: userId ?? "u_scout",
          athleteId,
          createdAt: now(),
          status: "SENT",
        });
      });
    },
    [commit, userId],
  );

  const resetDemo = useCallback(() => {
    clearDatabase();
    const fresh = createSeedDatabase();
    setDb(fresh);
    saveDatabase(fresh);
  }, []);

  /** Athlete or college submits a past college-event record for verification. */
  const submitCollegeRecord: StoreValue["submitCollegeRecord"] = useCallback(
    (input) => {
      const college =
        db.colleges.find((c) => c.userId === userId) ??
        db.colleges.find(
          (c) => c.id === db.athletes.find((a) => a.id === input.athleteId)?.collegeId,
        );
      const athlete = db.athletes.find((a) => a.id === input.athleteId);
      if (!college || !athlete) return null;
      const record: CollegeRecord = {
        id: uid("rec"),
        collegeId: college.id,
        collegeName: college.shortName,
        athleteId: athlete.id,
        athleteName: athlete.name,
        sportId: input.sportId,
        sportName: db.sports.find((s) => s.id === input.sportId)?.name ?? input.sportId,
        eventName: input.eventName,
        season: input.season,
        level: input.level,
        title: input.title,
        description: input.description,
        representedFor: input.representedFor,
        status: input.autoCollegeVerify ? "COLLEGE_VERIFIED" : "SUBMITTED",
        collegeVerifiedBy: input.autoCollegeVerify ? college.shortName : "",
        adminVerifiedBy: "",
        submittedAt: now(),
        updatedAt: now(),
      };
      commit((draft) => {
        draft.collegeRecords.push(record);
      });
      return record;
    },
    [commit, db.athletes, db.colleges, db.sports, userId],
  );

  const collegeReviewRecord: StoreValue["collegeReviewRecord"] = useCallback(
    (recordId, approve) => {
      commit((draft) => {
        const rec = draft.collegeRecords.find((r) => r.id === recordId);
        if (!rec) return;
        const college = draft.colleges.find((c) => c.id === rec.collegeId);
        rec.status = approve ? "COLLEGE_VERIFIED" : "REJECTED";
        rec.collegeVerifiedBy = approve ? (college?.shortName ?? "College") : "";
        rec.updatedAt = now();
      });
    },
    [commit],
  );

  /** Final gate: an admin-verified record becomes public on the athlete profile. */
  const adminReviewRecord: StoreValue["adminReviewRecord"] = useCallback(
    (recordId, approve) => {
      commit((draft) => {
        const rec = draft.collegeRecords.find((r) => r.id === recordId);
        if (!rec) return;
        const wasVerified = rec.status === "ADMIN_VERIFIED";
        rec.status = approve ? "ADMIN_VERIFIED" : "REJECTED";
        rec.adminVerifiedBy = approve ? "KheloLocal Admin" : "";
        rec.updatedAt = now();
        const athlete = draft.athletes.find((a) => a.id === rec.athleteId);
        if (athlete && approve && !wasVerified) {
          athlete.verifiedAchievementsCount += 1;
          athlete.verificationStatus = "VERIFIED";
          athlete.updatedAt = now();
        }
      });
    },
    [commit],
  );

  const adminSetTournamentVerified: StoreValue["adminSetTournamentVerified"] = useCallback(
    (tournamentId, verified) => {
      commit((draft) => {
        const t = draft.tournaments.find((x) => x.id === tournamentId);
        if (!t) return;
        t.adminVerified = verified;
        t.updatedAt = now();
      });
    },
    [commit],
  );

  const adminSetAthleteVerification: StoreValue["adminSetAthleteVerification"] = useCallback(
    (athleteId, status) => {
      commit((draft) => {
        const a = draft.athletes.find((x) => x.id === athleteId);
        if (!a) return;
        a.verificationStatus = status;
        a.updatedAt = now();
      });
    },
    [commit],
  );

  const unusedResetPlaceholder = useCallback(() => {
    clearDatabase();
    const fresh = createSeedDatabase();
    setDb(fresh);
    saveDatabase(fresh);
  }, []);

  const value: StoreValue = {
    db,
    hydrated,
    currentUser,
    login,
    logout,
    signup,
    createTournament,
    register,
    setRegistrationStatus,
    generateFixtures,
    saveMatch,
    finishMatch,
    verifyMatch,
    toggleSaveAthlete,
    requestConnection,
    submitCollegeRecord,
    collegeReviewRecord,
    adminReviewRecord,
    adminSetTournamentVerified,
    adminSetAthleteVerification,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useKhelo() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useKhelo must be used inside KheloProvider");
  return ctx;
}

export function useCurrentAthlete() {
  const { db, currentUser } = useKhelo();
  return currentUser ? (db.athletes.find((a) => a.userId === currentUser.id) ?? null) : null;
}

export function useCurrentOrganizer() {
  const { db, currentUser } = useKhelo();
  return currentUser ? (db.organizers.find((o) => o.userId === currentUser.id) ?? null) : null;
}

export { athleteById, matchById, tournamentById };
export type { Match };