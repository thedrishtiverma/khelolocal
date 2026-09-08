/**
 * Sport visual language: a faint field/court motif per sport plus a tint used
 * for initials avatars so athlete and tournament lists stay scannable.
 * Purely presentational — no data or behaviour depends on this.
 */
export type SportTone = "field" | "accent" | "navy";

const TONE_BY_SPORT: Record<string, SportTone> = {
  football: "field",
  khokho: "field",
  athletics: "field",
  kabaddi: "accent",
  boxing: "accent",
  badminton: "accent",
  basketball: "navy",
  volleyball: "navy",
  cricket: "navy",
  yoga: "navy",
};

const MOTIF_BY_TONE: Record<SportTone, string> = {
  field: "motif-pitch",
  accent: "motif-court",
  navy: "motif-track",
};

export function sportTone(sportId?: string | null): SportTone {
  if (!sportId) return "navy";
  return TONE_BY_SPORT[sportId] ?? "navy";
}

export function sportMotif(sportId?: string | null): string {
  return MOTIF_BY_TONE[sportTone(sportId)];
}

export function sportTint(sportId?: string | null): string {
  switch (sportTone(sportId)) {
    case "field":
      return "bg-verified/15 text-verified";
    case "accent":
      return "bg-accent/25 text-accent-ink";
    default:
      return "bg-primary/10 text-primary";
  }
}
