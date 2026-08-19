import { createSeedDatabase } from "@/data/seed";
import { sportLabel } from "@/lib/format";

export const SITE_URL = "https://khelolocal.lovable.app";

let cached: ReturnType<typeof createSeedDatabase> | null = null;
function catalog() {
  if (!cached) cached = createSeedDatabase();
  return cached;
}

export function seoTournament(id: string) {
  return catalog().tournaments.find((t) => t.id === id);
}

export function seoAthlete(id: string) {
  return catalog().athletes.find((a) => a.id === id);
}

export function sportName(sportId: string) {
  return sportLabel(sportId);
}

export function canonical(path: string) {
  return { rel: "canonical" as const, href: `${SITE_URL}${path}` };
}

export function ogUrl(path: string) {
  return { property: "og:url", content: `${SITE_URL}${path}` };
}