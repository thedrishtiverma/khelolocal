import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useKhelo } from "@/lib/services/store";
import { canViewProfile } from "@/lib/services/relationships";
import { VerifiedBadge } from "@/components/shared/Badges";
import { Initials } from "@/components/shared/Bits";
import { RoleIcon } from "@/components/shared/KheloIcon";
import { SimpleBanner } from "@/components/shared/SimpleBanner";
import { sportLabel } from "@/lib/format";
import { sportTint } from "@/lib/sport-visuals";
import type { Athlete } from "@/types";

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const { db, currentUser, toggleProfileFollow, toggleSavedProfile } = useKhelo();
  const following = (db.profileFollows ?? []).some(
    (follow) =>
      follow.followerProfileId === currentUser?.id && follow.followedProfileId === athlete.userId,
  );
  const saved = (db.savedProfiles ?? []).some(
    (item) => item.profileId === currentUser?.id && item.targetProfileId === athlete.userId,
  );
  const isOwner = currentUser?.id === athlete.userId;
  const relationshipActionsAvailable = !isSupabaseConfigured();
  const canInteract = currentUser && !isOwner && canViewProfile(db, currentUser.id, athlete.userId);

  const runAction = (action: () => void, message: string) => {
    try {
      action();
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The action could not be completed.");
    }
  };

  return (
    <article className="data-card group rounded-xl p-6 theme-fade">
      <SimpleBanner
        label={`${sportLabel(athlete.primarySport)} · ${athlete.cityName}`}
        icon={<RoleIcon role="athlete" className="size-4" />}
        tone="athlete"
      />
      <div className="mt-5">
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

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/athletes/$id" params={{ id: athlete.id }}>
              View profile
            </Link>
          </Button>
          {canInteract ? (
            <>
              <Button
                size="sm"
                variant={following ? "outline" : "default"}
                disabled={!relationshipActionsAvailable}
                title={
                  relationshipActionsAvailable
                    ? undefined
                    : "Relationship actions are paused until the hosted database schema is confirmed."
                }
                onClick={() =>
                  runAction(
                    () => toggleProfileFollow(athlete.userId),
                    following ? "Profile unfollowed" : "Following athlete",
                  )
                }
              >
                <Heart className="size-4" />
                {following ? "Following" : "Follow"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!relationshipActionsAvailable}
                onClick={() =>
                  runAction(
                    () => toggleSavedProfile(athlete.userId),
                    saved ? "Removed from saved profiles" : "Athlete saved",
                  )
                }
                aria-label={saved ? `Unsave ${athlete.name}` : `Save ${athlete.name}`}
              >
                {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
