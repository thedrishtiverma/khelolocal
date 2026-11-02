export const SPORT_ICON_REGISTRY = {
  football: { icon: "sport-football", label: "Football" },
  cricket: { icon: "sport-cricket", label: "Cricket" },
  kabaddi: { icon: "sport-kabaddi", label: "Kabaddi" },
  basketball: { icon: "sport-basketball", label: "Basketball" },
  "kho-kho": { icon: "sport-kho-kho", label: "Kho-Kho" },
  khokho: { icon: "sport-kho-kho", label: "Kho-Kho" },
  badminton: { icon: "sport-badminton", label: "Badminton" },
  boxing: { icon: "sport-boxing", label: "Boxing" },
  yoga: { icon: "sport-yoga", label: "Yoga" },
  volleyball: { icon: "sport-volleyball", label: "Volleyball" },
  "table-tennis": { icon: "sport-table-tennis", label: "Table Tennis" },
  tennis: { icon: "sport-tennis", label: "Tennis" },
  athletics: { icon: "sport-athletics", label: "Athletics" },
} as const;

export const SPORT_CATALOG = [
  "football",
  "cricket",
  "kabaddi",
  "basketball",
  "kho-kho",
  "badminton",
  "boxing",
  "yoga",
  "volleyball",
  "table-tennis",
  "tennis",
  "athletics",
] as const;

export const ROLE_ICON_REGISTRY = {
  athlete: "role-athlete",
  team: "role-team",
  coach: "role-coach",
  organizer: "role-organizer",
  institution: "role-institution",
  scout: "role-scout",
  volunteer: "role-volunteer",
  admin: "role-admin",
} as const;

export const ROLE_CATALOG = [
  "athlete",
  "team",
  "coach",
  "organizer",
  "institution",
  "scout",
  "volunteer",
  "admin",
] as const;

export type KheloRole = keyof typeof ROLE_ICON_REGISTRY;
export type KheloSportIconName =
  (typeof SPORT_ICON_REGISTRY)[keyof typeof SPORT_ICON_REGISTRY]["icon"];
export type KheloRoleIconName = (typeof ROLE_ICON_REGISTRY)[KheloRole];

export const ACTIVITY_ICON_REGISTRY = {
  tournament: "activity-tournament",
  match: "activity-match",
  fixture: "activity-fixture",
  score: "activity-score",
  result: "activity-result",
  achievement: "activity-achievement",
  verification: "activity-verification",
  registration: "activity-registration",
  roster: "activity-roster",
  venue: "activity-venue",
  discovery: "activity-discovery",
  connection: "activity-connection",
} as const;

export const ACTIVITY_CATALOG = [
  "tournament",
  "match",
  "fixture",
  "score",
  "result",
  "achievement",
  "verification",
  "registration",
  "roster",
  "venue",
  "discovery",
  "connection",
] as const;

export type KheloActivity = keyof typeof ACTIVITY_ICON_REGISTRY;
export type KheloActivityIconName = (typeof ACTIVITY_ICON_REGISTRY)[KheloActivity];

export const STATUS_ICON_REGISTRY = {
  live: "status-live",
  upcoming: "status-upcoming",
  open: "status-open",
  completed: "status-completed",
  verified: "status-verified",
  pending: "status-pending",
  full: "status-full",
  cancelled: "status-cancelled",
  rejected: "status-rejected",
} as const;

export const STATUS_CATALOG = [
  "live",
  "upcoming",
  "open",
  "completed",
  "verified",
  "pending",
  "full",
  "cancelled",
  "rejected",
] as const;

export type KheloStatus = keyof typeof STATUS_ICON_REGISTRY;
export type KheloStatusIconName = (typeof STATUS_ICON_REGISTRY)[KheloStatus];

export type KheloIconName =
  | "brand-local"
  | KheloSportIconName
  | KheloRoleIconName
  | KheloActivityIconName
  | KheloStatusIconName;
