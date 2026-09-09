import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/shared/Badges";
import { Initials } from "@/components/shared/Bits";
import { sportLabel } from "@/lib/format";
import { sportMotif, sportTint } from "@/lib/sport-visuals";
import type { Athlete } from "@/types";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const motif = sportMotif(athlete.primarySport);
  return (
    <article className={`data-card flex flex-col rounded-xl p-6 theme-fade ${motif}`}>
      <div className="flex items-start gap-4">
        <Initials
          name={athlete.name}
          tint={sportTint(athlete.primarySport)}
          className="size-14 text-lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold leading-tight">{athlete.name}</h3>
          <p className="text-sm text-muted-foreground">
            {sportLabel(athlete.primarySport)} · {athlete.collegeName ?? "Independent"} ·{" "}
            {athlete.cityName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {athlete.position || "Position not set"} · {athlete.ageCategory}
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-h-6 items-center justify-between gap-2">
        {athlete.verificationStatus === "VERIFIED" ? (
          <VerifiedBadge label="Institution verified" />
        ) : (
          <span className="text-xs text-muted-foreground">Verification pending</span>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        <strong className="text-foreground">{athlete.tournamentsPlayed}</strong> tournaments ·{" "}
        <strong className="text-foreground">{athlete.verifiedAchievementsCount}</strong>{" "}
        achievements
      </p>

      <Button asChild variant="secondary" className="mt-5">
        <Link to="/athletes/$id" params={{ id: athlete.id }}>
          View profile
        </Link>
      </Button>
    </article>
  );
}
