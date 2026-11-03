import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/shared/Badges";
import { Initials } from "@/components/shared/Bits";
import { RoleIcon } from "@/components/shared/KheloIcon";
import { sportLabel } from "@/lib/format";
import { sportTint } from "@/lib/sport-visuals";
import type { Athlete } from "@/types";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  return (
    <article className="data-card group rounded-xl p-6 theme-fade">
      <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {sportLabel(athlete.primarySport)} · {athlete.cityName}
      </div>
      <div>
        <div className="flex items-start gap-4">
          <div className="relative size-16 shrink-0">
            <Initials
              name={athlete.name}
              tint={sportTint(athlete.primarySport)}
              className="profile-banner-avatar size-16 rounded-xl border-4 text-lg shadow-lg"
            />
            <span className="profile-role-mark absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-card bg-surface text-lime shadow-md">
              <RoleIcon role="athlete" className="size-3.5" />
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-lime">
              {athlete.name}
            </h3>
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
            <VerifiedBadge label="Institution verified" className="text-[0.7125rem]" />
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
      </div>
    </article>
  );
}
