import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/shared/Badges";
import { Initials } from "@/components/shared/Bits";
import { sportLabel } from "@/lib/format";
import { sportMotif, sportTint } from "@/lib/sport-visuals";
import type { Athlete } from "@/types";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const motif = sportMotif(athlete.primarySport);
  return (
    <article
      className={`data-card flex flex-col rounded-xl p-6 theme-fade ${motif}`}
    >
      <div className="flex items-start gap-4">
        <Initials name={athlete.name} tint={sportTint(athlete.primarySport)} className="size-14 text-lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold leading-tight">{athlete.name}</h3>
          <p className="text-sm text-muted-foreground">
            {sportLabel(athlete.primarySport)} · {athlete.position || "—"}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {athlete.cityName} · {athlete.ageCategory}
          </p>
          {athlete.collegeName ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{athlete.collegeName}</p>
          ) : null}
        </div>
      </div>

      <div className="data-card-muted mt-5 grid grid-cols-3 gap-2 rounded-lg border border-border/70 px-3 py-4 text-center">
        <div>
          <p className="stat-num text-xl">{athlete.matchesPlayed}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Matches
          </p>
        </div>
        <div>
          <p className="stat-num text-xl">{athlete.wins}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Wins
          </p>
        </div>
        <div>
          <p className="stat-num text-xl">
            {athlete.primarySport === "football" ? athlete.goals : athlete.tournamentsPlayed}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {athlete.primarySport === "football" ? "Goals" : "Tournaments"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-6 items-center justify-between gap-2">
        {athlete.verifiedAchievementsCount > 0 ? (
          <VerifiedBadge label={`${athlete.verifiedAchievementsCount} verified achievements`} />
        ) : (
          <span className="text-xs text-muted-foreground">No verified achievements yet</span>
        )}
      </div>

      <Button asChild variant="secondary" className="mt-5">
        <Link to="/athletes/$id" params={{ id: athlete.id }}>
          View profile
        </Link>
      </Button>
    </article>
  );
}