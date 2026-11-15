import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Heart, Send, UserCheck, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";
import { AthleteProfileView } from "@/components/athlete/AthleteProfileView";
import { athleteById, useKhelo } from "@/lib/services/store";
import { isAthletePubliclyDiscoverable } from "@/lib/services/selectors";
import {
  areProfilesConnected,
  canViewProfile,
  isProfileBlocked,
} from "@/lib/services/relationships";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

export const Route = createFileRoute("/athletes/$id")({
  head: () => ({
    meta: [
      { title: "Athlete profile | KheloLocal" },
      {
        name: "description",
        content:
          "A verified KheloLocal athlete profile: tournament record, match stats and organizer-verified achievements.",
      },
      { property: "og:title", content: "Athlete profile | KheloLocal" },
      { property: "og:description", content: "Verified local sporting record." },
    ],
  }),
  component: AthletePublicProfile,
});

function AthletePublicProfile() {
  const { id } = Route.useParams();
  const {
    db,
    currentUser,
    toggleProfileFollow,
    requestProfileConnection,
    cancelProfileConnection,
    respondToProfileConnection,
    removeProfileConnection,
    toggleSavedProfile,
    blockProfile,
    unblockProfile,
  } = useKhelo();
  const [introduction, setIntroduction] = useState("");
  const athlete = athleteById(db, id);

  if (!athlete) {
    return (
      <Page>
        <EmptyState
          title="Athlete not found"
          action={
            <Button asChild>
              <Link to="/athletes">Back to discovery</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  if (!isAthletePubliclyDiscoverable(athlete)) {
    return (
      <Page>
        <EmptyState
          title="This athlete profile isn't public"
          description="Profiles for athletes under 18, or whose age cannot be established, aren't available in public discovery until guardian verification is supported."
          action={
            <Button asChild>
              <Link to="/athletes">Back to discovery</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const isOwner = currentUser?.id === athlete.userId;
  const visible = canViewProfile(db, currentUser?.id ?? null, athlete.userId);
  if (!visible) {
    return (
      <Page>
        <EmptyState
          title="This athlete profile isn't available"
          description="The profile owner has limited its visibility or this profile is unavailable to your account."
          action={
            <Button asChild>
              <Link to="/athletes">Back to discovery</Link>
            </Button>
          }
        />
      </Page>
    );
  }
  const saved = (db.savedProfiles ?? []).some(
    (item) => item.profileId === currentUser?.id && item.targetProfileId === athlete.userId,
  );
  const following = (db.profileFollows ?? []).some(
    (follow) =>
      follow.followerProfileId === currentUser?.id && follow.followedProfileId === athlete.userId,
  );
  const connected = currentUser ? areProfilesConnected(db, currentUser.id, athlete.userId) : false;
  const request = (db.profileConnectionRequests ?? []).find(
    (item) =>
      item.status === "PENDING" &&
      ((item.requesterProfileId === currentUser?.id &&
        item.recipientProfileId === athlete.userId) ||
        (item.requesterProfileId === athlete.userId &&
          item.recipientProfileId === currentUser?.id)),
  );
  const blocked = currentUser ? isProfileBlocked(db, currentUser.id, athlete.userId) : false;
  const localMode = !isSupabaseConfigured();
  const unavailableTitle = localMode
    ? undefined
    : "Relationship features are paused until the hosted database schema is confirmed.";

  const notifyAction = (action: () => void, success: string) => {
    try {
      action();
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The action could not be completed.");
    }
  };

  return (
    <Page>
      <AthleteProfileView
        athlete={athlete}
        actions={
          !isOwner && currentUser ? (
            <div className="flex flex-col gap-3">
              {!localMode ? (
                <p className="max-w-sm text-xs text-muted-foreground" role="status">
                  Relationship actions are temporarily unavailable while the hosted data model is
                  being confirmed.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={following ? "secondary" : "outline"}
                  disabled={!localMode || blocked}
                  title={unavailableTitle}
                  onClick={() =>
                    notifyAction(
                      () => toggleProfileFollow(athlete.userId),
                      following ? "Profile unfollowed" : "Following athlete",
                    )
                  }
                >
                  <Heart className="size-4" />
                  {following ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="secondary"
                  disabled={!localMode || blocked}
                  title={unavailableTitle}
                  onClick={() =>
                    notifyAction(
                      () => toggleSavedProfile(athlete.userId),
                      saved ? "Removed from saved profiles" : "Athlete saved",
                    )
                  }
                >
                  {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                  {saved ? "Saved" : "Save"}
                </Button>
                {connected ? (
                  <Button
                    variant="outline"
                    disabled={!localMode}
                    title={unavailableTitle}
                    onClick={() =>
                      notifyAction(
                        () => removeProfileConnection(athlete.userId),
                        "Connection removed",
                      )
                    }
                  >
                    <UserCheck className="size-4" /> Connected
                  </Button>
                ) : request?.requesterProfileId === currentUser.id ? (
                  <Button
                    variant="outline"
                    disabled={!localMode}
                    title={unavailableTitle}
                    onClick={() =>
                      notifyAction(
                        () => cancelProfileConnection(request.id),
                        "Connection request cancelled",
                      )
                    }
                  >
                    <X className="size-4" /> Cancel request
                  </Button>
                ) : request ? (
                  <>
                    <Button
                      disabled={!localMode}
                      title={unavailableTitle}
                      onClick={() =>
                        notifyAction(
                          () => respondToProfileConnection(request.id, "ACCEPTED"),
                          "Connection accepted",
                        )
                      }
                    >
                      <UserCheck className="size-4" /> Accept request
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!localMode}
                      title={unavailableTitle}
                      onClick={() =>
                        notifyAction(
                          () => respondToProfileConnection(request.id, "DECLINED"),
                          "Request declined",
                        )
                      }
                    >
                      Decline
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={!localMode || blocked}
                    title={unavailableTitle}
                    onClick={() =>
                      notifyAction(
                        () => requestProfileConnection(athlete.userId, introduction),
                        "Connection request sent",
                      )
                    }
                  >
                    <UserPlus className="size-4" />
                    Connect
                  </Button>
                )}
                {blocked ? (
                  <Button
                    variant="outline"
                    disabled={!localMode}
                    onClick={() =>
                      notifyAction(() => unblockProfile(athlete.userId), "Profile unblocked")
                    }
                  >
                    Unblock
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    disabled={!localMode}
                    title={unavailableTitle}
                    onClick={() =>
                      notifyAction(() => blockProfile(athlete.userId), "Profile blocked")
                    }
                  >
                    Block
                  </Button>
                )}
              </div>
              {!request && !connected ? (
                <label className="max-w-lg space-y-1 text-xs font-semibold text-muted-foreground">
                  Optional introduction
                  <textarea
                    value={introduction}
                    onChange={(event) => setIntroduction(event.target.value.slice(0, 280))}
                    maxLength={280}
                    rows={2}
                    placeholder="Add a short note with your request"
                    disabled={!localMode || blocked}
                    className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground"
                  />
                </label>
              ) : null}
            </div>
          ) : null
        }
      />
    </Page>
  );
}
