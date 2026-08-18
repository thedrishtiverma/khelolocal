export type Role = "ATHLETE" | "ORGANIZER" | "SCOUT" | "COLLEGE" | "ADMIN";

/** How far an athlete progressed in the college -> national selection ladder. */
export type SelectionLevel = "COLLEGE" | "NODAL" | "STATE" | "NATIONAL";

export type RecordStatus = "SUBMITTED" | "COLLEGE_VERIFIED" | "ADMIN_VERIFIED" | "REJECTED";

export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED";

export type TournamentStatus =
  | "DRAFT"
  | "UPCOMING"
  | "REGISTRATION_OPEN"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";
export type MatchStatus = "SCHEDULED" | "LIVE" | "COMPLETED";
export type ResultStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  cityId: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Athlete {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  cityId: string;
  cityName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  primarySport: string;
  secondarySports: string[];
  position: string;
  positionGroup: "FORWARD" | "MIDFIELD" | "DEFENCE" | "GOALKEEPER" | "RAIDER" | "DEFENDER" | "ALL_ROUNDER";
  ageCategory: string;
  skills: string[];
  bio: string;
  verificationStatus: VerificationStatus;
  tournamentsPlayed: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  goals: number;
  verifiedAchievementsCount: number;
  collegeId?: string;
  collegeName?: string;
  enrollmentYear?: string;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  userId: string;
  name: string;
  shortName: string;
  cityId: string;
  cityName: string;
  sportsEventName: string;
  description: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * A past sporting record from a college event (e.g. VARCHASVA annual sports meet),
 * verified first by the college and then by the platform admin.
 */
export interface CollegeRecord {
  id: string;
  collegeId: string;
  collegeName: string;
  athleteId: string;
  athleteName: string;
  sportId: string;
  sportName: string;
  eventName: string;
  season: string;
  level: SelectionLevel;
  title: string;
  description: string;
  representedFor: string;
  status: RecordStatus;
  collegeVerifiedBy: string;
  adminVerifiedBy: string;
  submittedAt: string;
  updatedAt: string;
}

export interface Organizer {
  id: string;
  userId: string;
  organizationName: string;
  organizationType: string;
  cityId: string;
  cityName: string;
  description: string;
  logo: string;
  phone: string;
  email: string;
  verificationStatus: VerificationStatus;
  tournamentsHosted: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  active: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  sportId: string;
  sportName: string;
  organizerId: string;
  organizerName: string;
  cityId: string;
  cityName: string;
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  ageCategory: string;
  genderCategory: string;
  format: string;
  maxParticipants: number;
  currentParticipants: number;
  registrationFee: number;
  prizePool: number;
  description: string;
  status: TournamentStatus;
  bannerImage: string;
  /** Data-integrity flag set by the platform admin. */
  adminVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  tournamentId: string;
  athleteId: string;
  teamId: string | null;
  registrationDate: string;
  status: RegistrationStatus;
  paymentStatus: "NOT_REQUIRED";
  seedNumber: number | null;
}

export interface Team {
  id: string;
  name: string;
  sportId: string;
  sportName: string;
  cityId: string;
  cityName: string;
  logo: string;
  captainId: string;
  coachId: string | null;
  players: string[];
  createdAt: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: string;
  matchNumber: number;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  scheduledAt: string;
  venue: string;
  status: MatchStatus;
  winnerId: string | null;
  resultStatus: ResultStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerPerformance {
  id: string;
  matchId: string;
  tournamentId: string;
  athleteId: string;
  teamId: string;
  goals: number;
  assists: number;
  points: number;
  playerOfMatch: boolean;
  performanceNotes: string;
  verified: boolean;
  /** Sport-specific optional metrics (kabaddi etc.) */
  raidPoints?: number;
  tacklePoints?: number;
  bonusPoints?: number;
  createdAt: string;
}

export interface Verification {
  id: string;
  matchId: string;
  tournamentId: string;
  organizerId: string;
  status: ResultStatus;
  verifiedAt: string;
  verificationNote: string;
}

export type AchievementType =
  | "TOURNAMENT_WIN"
  | "RUNNER_UP"
  | "PLAYER_OF_MATCH"
  | "TOP_SCORER"
  | "MATCH_PERFORMANCE";

export interface Achievement {
  id: string;
  athleteId: string;
  tournamentId: string;
  matchId: string | null;
  title: string;
  description: string;
  achievementType: AchievementType;
  verified: boolean;
  verifiedBy: string;
  date: string;
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  scoutUserId: string;
  athleteId: string;
  createdAt: string;
  status: "SENT";
}

export interface Database {
  users: User[];
  athletes: Athlete[];
  organizers: Organizer[];
  colleges: College[];
  collegeRecords: CollegeRecord[];
  sports: Sport[];
  cities: City[];
  tournaments: Tournament[];
  registrations: Registration[];
  teams: Team[];
  matches: Match[];
  playerPerformances: PlayerPerformance[];
  verifications: Verification[];
  achievements: Achievement[];
  connections: ConnectionRequest[];
  savedAthletes: string[];
}