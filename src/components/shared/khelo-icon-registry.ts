const ASSET_ROOT = "/src/assets/khelolocal";

export const SPORT_CATALOG = [
  "football",
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

export type KheloSportId = (typeof SPORT_CATALOG)[number];

function sportAssets<const Id extends KheloSportId>(id: Id, label: string) {
  return {
    id,
    icon: `sport-${id}` as const,
    label,
    iconPath: `${ASSET_ROOT}/icons/sports/${id}.svg`,
    bannerPath: `${ASSET_ROOT}/banners/sports/${id}.svg`,
  };
}

export const SPORT_ICON_REGISTRY = {
  football: sportAssets("football", "Football"),
  kabaddi: sportAssets("kabaddi", "Kabaddi"),
  basketball: sportAssets("basketball", "Basketball"),
  "kho-kho": sportAssets("kho-kho", "Kho-Kho"),
  badminton: sportAssets("badminton", "Badminton"),
  boxing: sportAssets("boxing", "Boxing"),
  yoga: sportAssets("yoga", "Yoga"),
  volleyball: sportAssets("volleyball", "Volleyball"),
  "table-tennis": sportAssets("table-tennis", "Table Tennis"),
  tennis: sportAssets("tennis", "Tennis"),
  athletics: sportAssets("athletics", "Athletics"),
} satisfies Record<KheloSportId, ReturnType<typeof sportAssets>>;

const SPORT_ID_ALIASES: Record<string, KheloSportId> = {
  football: "football",
  kabaddi: "kabaddi",
  basketball: "basketball",
  khokho: "kho-kho",
  badminton: "badminton",
  boxing: "boxing",
  yoga: "yoga",
  volleyball: "volleyball",
  tabletennis: "table-tennis",
  tennis: "tennis",
  athletics: "athletics",
};

function compactSportId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function canonicalSportId(value: string): KheloSportId | undefined {
  return SPORT_ID_ALIASES[compactSportId(value)];
}

export function sportIconName(value: string): KheloIconName {
  const id = canonicalSportId(value);
  return id ? SPORT_ICON_REGISTRY[id].icon : "brand-local";
}

export function sportIconLabel(value: string): string {
  const id = canonicalSportId(value);
  return id ? SPORT_ICON_REGISTRY[id].label : `Uncatalogued sport: ${value}`;
}

export function sportBannerPath(value: string): string | undefined {
  const id = canonicalSportId(value);
  return id ? SPORT_ICON_REGISTRY[id].bannerPath : undefined;
}

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

export type KheloRole = (typeof ROLE_CATALOG)[number];

export const ROLE_ICON_REGISTRY = {
  athlete: "role-athlete",
  team: "role-team",
  coach: "role-coach",
  organizer: "role-organizer",
  institution: "role-institution",
  scout: "role-scout",
  volunteer: "role-volunteer",
  admin: "role-admin",
} as const satisfies Record<KheloRole, `role-${KheloRole}`>;

export const ROLE_BANNER_REGISTRY: Record<KheloRole, string> = {
  athlete: `${ASSET_ROOT}/banners/roles/athlete.svg`,
  team: `${ASSET_ROOT}/banners/roles/team.svg`,
  coach: `${ASSET_ROOT}/banners/roles/coach.svg`,
  organizer: `${ASSET_ROOT}/banners/roles/organizer.svg`,
  institution: `${ASSET_ROOT}/banners/roles/institution.svg`,
  scout: `${ASSET_ROOT}/banners/roles/scout.svg`,
  volunteer: `${ASSET_ROOT}/banners/roles/volunteer.svg`,
  admin: `${ASSET_ROOT}/banners/roles/admin.svg`,
};

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
export type KheloIconName =
  | "brand-local"
  | (typeof SPORT_ICON_REGISTRY)[KheloSportId]["icon"]
  | (typeof ROLE_ICON_REGISTRY)[KheloRole]
  | (typeof ACTIVITY_ICON_REGISTRY)[KheloActivity]
  | (typeof STATUS_ICON_REGISTRY)[KheloStatus];

const ICON_ASSET_PATHS: Partial<Record<KheloIconName, string>> = {
  ...Object.fromEntries(
    SPORT_CATALOG.map((id) => [SPORT_ICON_REGISTRY[id].icon, SPORT_ICON_REGISTRY[id].iconPath]),
  ),
  "role-athlete": `${ASSET_ROOT}/icons/roles/athlete.svg`,
  "role-team": `${ASSET_ROOT}/icons/roles/team.svg`,
  "role-coach": `${ASSET_ROOT}/icons/roles/coach.svg`,
  "role-organizer": `${ASSET_ROOT}/icons/roles/organizer.svg`,
  "role-institution": `${ASSET_ROOT}/icons/roles/institution.svg`,
  "role-scout": `${ASSET_ROOT}/icons/roles/scout.svg`,
  "role-volunteer": `${ASSET_ROOT}/icons/roles/volunteer.svg`,
  "role-admin": `${ASSET_ROOT}/icons/roles/admin.svg`,
  "activity-tournament": `${ASSET_ROOT}/icons/activity/tournament.svg`,
  "activity-match": `${ASSET_ROOT}/icons/activity/match.svg`,
  "activity-fixture": `${ASSET_ROOT}/icons/activity/fixture.svg`,
  "activity-score": `${ASSET_ROOT}/icons/activity/score.svg`,
  "activity-result": `${ASSET_ROOT}/icons/activity/result.svg`,
  "activity-achievement": `${ASSET_ROOT}/icons/activity/achievement.svg`,
  "activity-verification": `${ASSET_ROOT}/icons/activity/verified.svg`,
  "activity-registration": `${ASSET_ROOT}/icons/activity/registration.svg`,
  "activity-venue": `${ASSET_ROOT}/icons/activity/venue.svg`,
  "activity-discovery": `${ASSET_ROOT}/icons/activity/discover.svg`,
  "activity-connection": `${ASSET_ROOT}/icons/activity/connections.svg`,
  "status-live": `${ASSET_ROOT}/icons/status/live.svg`,
  "status-upcoming": `${ASSET_ROOT}/icons/status/upcoming.svg`,
  "status-completed": `${ASSET_ROOT}/icons/status/completed.svg`,
  "status-verified": `${ASSET_ROOT}/icons/status/verified.svg`,
  "status-pending": `${ASSET_ROOT}/icons/status/pending.svg`,
  "status-full": `${ASSET_ROOT}/icons/status/full.svg`,
};

const SVG_ASSETS = import.meta.glob<string>("/src/assets/khelolocal/**/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

export function resolveKheloIconAsset(name: KheloIconName): string | undefined {
  const path = ICON_ASSET_PATHS[name];
  return path ? SVG_ASSETS[path] : undefined;
}

export function resolveKheloBannerAsset(path: string | undefined): string | undefined {
  return path ? SVG_ASSETS[path] : undefined;
}
