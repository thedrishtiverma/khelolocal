import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/shared/Badges";
import { Initials, KeywordHighlight } from "@/components/shared/Bits";
import { RoleIcon } from "@/components/shared/KheloIcon";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import { sportLabel } from "@/lib/format";
import { sportMotif, sportTint } from "@/lib/sport-visuals";
import type { Athlete } from "@/types";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const motif = sportMotif(athlete.primarySport);
  return (
    <article className={`data-card overflow-hidden rounded-xl p-0 theme-fade ${motif}`}>
      <div
        className={`athlete-card-banner athlete-card-banner-${athlete.primarySport} khelo-banner-surface relative min-h-28`}
      >
        <BannerArtwork sportId={athlete.primarySport} role="athlete" />
        <span className="athlete-card-sport">
          {sportLabel(athlete.primarySport)} · {athlete.cityName}
        </span>
      </div>
      <div className="relative px-6 pb-6 pt-6">
        <div className="flex items-start gap-4">
          <div className="relative -mt-12 size-16 shrink-0">
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
            <h3 className="font-display text-xl font-bold leading-tight text-foreground">
              <KeywordHighlight text={athlete.name} />
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
      </div>
    </article>
  );
}
