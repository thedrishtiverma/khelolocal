import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, Initials, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { formatDate } from "@/lib/format";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useKhelo } from "@/lib/services/store";
import {
  areProfilesConnected,
  canViewProfile,
  isProfileBlocked,
} from "@/lib/services/relationships";

type NetworkTab =
  "requests" | "sent" | "connections" | "following" | "followers" | "saved" | "blocked";

const TABS: { id: NetworkTab; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "sent", label: "Sent" },
  { id: "connections", label: "Connections" },
  { id: "following", label: "Following" },
  { id: "followers", label: "Followers" },
  { id: "saved", label: "Saved" },
  { id: "blocked", label: "Blocked" },
];

export const Route = createFileRoute("/connections")({
  head: () => ({
    meta: [
      { title: "My network | KheloLocal" },
      {
        name: "description",
        content: "Manage your connection requests, relationships and saved profiles.",
      },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const {
    db,
    currentUser,
    respondToProfileConnection,
    cancelProfileConnection,
    removeProfileConnection,
    toggleProfileFollow,
    toggleSavedProfile,
    unblockProfile,
  } = useKhelo();
  const [tab, setTab] = useState<NetworkTab>("requests");
  const requests = db.profileConnectionRequests ?? [];
  const follows = db.profileFollows ?? [];
  const connections = db.profileConnections ?? [];
  const saved = db.savedProfiles ?? [];
  const blocks = db.profileBlocks ?? [];

  if (!currentUser) {
    return (
      <Page>
        <SectionHeading compact eyebrow="Your sports network" title="My network" />
        <EmptyState
          title="Sign in to manage your network"
          description="Use a demo account to try following profiles, connection requests and saved athletes."
          action={
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const actorId = currentUser.id;
  const incoming = requests.filter(
    (request) => request.recipientProfileId === actorId && request.status === "PENDING",
  );
  const sent = requests.filter(
    (request) => request.requesterProfileId === actorId && request.status === "PENDING",
  );
  const myConnections = connections
    .map((connection) =>
      connection.profileAId === actorId ? connection.profileBId : connection.profileAId,
    );
  const following = follows
    .filter((follow) => follow.followerProfileId === actorId)
    .map((follow) => follow.followedProfileId);
  const followers = follows
    .filter((follow) => follow.followedProfileId === actorId)
    .map((follow) => follow.followerProfileId);
  const savedProfiles = saved
    .filter((item) => item.profileId === actorId)
    .map((item) => item.targetProfileId);
  const blocked = blocks
    .filter((item) => item.blockerProfileId === actorId)
    .map((item) => item.blockedProfileId);

  const notifyAction = (action: () => void, message: string) => {
    try {
      action();
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The action could not be completed.");
    }
  };

  const profileName = (profileId: string) =>
    canViewProfile(db, actorId, profileId)
      ? (db.users.find((user) => user.id === profileId)?.name ?? "Unavailable profile")
      : "Private profile";
  const profileRole = (profileId: string) =>
    canViewProfile(db, actorId, profileId)
      ? (db.users.find((user) => user.id === profileId)?.role ?? "PROFILE")
      : "PROFILE";
  const profileLink = (profileId: string) => {
    const athlete = db.athletes.find((item) => item.userId === profileId);
    return athlete && canViewProfile(db, actorId, profileId) ? (
      <Button asChild variant="outline" size="sm">
        <Link to="/athletes/$id" params={{ id: athlete.id }}>
          View profile
        </Link>
      </Button>
    ) : null;
  };

  const renderProfiles = (
    profileIds: string[],
    action?: (profileId: string) => React.ReactNode,
  ) => {
    if (!profileIds.length) return <EmptyState title="Nothing here yet." />;
    return (
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {profileIds.map((profileId) => (
          <li key={profileId} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
            <Initials name={profileName(profileId)} className="size-11" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{profileName(profileId)}</p>
              <p className="text-xs text-muted-foreground">{profileRole(profileId)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileLink(profileId)}
              {action?.(profileId)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderRequests = (items: typeof requests, incomingRequests: boolean) => {
    if (!items.length) return <EmptyState title="No pending requests." />;
    return (
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {items.map((request) => {
          const profileId = incomingRequests
            ? request.requesterProfileId
            : request.recipientProfileId;
          return (
            <li key={request.id} className="flex flex-wrap items-center gap-3 p-4">
              <Initials name={profileName(profileId)} className="size-11" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{profileName(profileId)}</p>
                <p className="text-xs text-muted-foreground">
                  {profileRole(profileId)} · {formatDate(request.createdAt)}
                </p>
                {request.introductionNote ? (
                  <p className="mt-2 text-sm text-muted-foreground">{request.introductionNote}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileLink(profileId)}
                {incomingRequests ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        notifyAction(
                          () => respondToProfileConnection(request.id, "ACCEPTED"),
                          "Connection accepted",
                        )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
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
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      notifyAction(() => cancelProfileConnection(request.id), "Request cancelled")
                    }
                  >
                    Cancel request
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  if (isSupabaseConfigured()) {
    return (
      <Page>
        <SectionHeading compact eyebrow="Your sports network" title="My network" />
        <EmptyState
          title="Network actions are temporarily paused"
          description="The hosted relationship schema must be confirmed before these actions can safely persist. Your account data has not been replaced by demo data."
        />
      </Page>
    );
  }

  return (
    <Page className="py-10 sm:py-14">
      <SectionHeading
        compact
        eyebrow="Your sports network"
        title="My network"
        subtitle="Manage your profile relationships. Demo changes are stored locally in this browser."
      />
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={myConnections.length} label="Connections" />
        <Stat value={followers.length} label="Followers" />
        <Stat value={following.length} label="Following" />
        <Stat value={incoming.length + sent.length} label="Pending requests" />
      </div>

      <div className="mt-8 border-b border-border">
        <nav className="flex gap-2 overflow-x-auto" aria-label="Network sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? "border-lime text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {item.id === "requests" && incoming.length ? ` (${incoming.length})` : ""}
            </button>
          ))}
        </nav>
      </div>

      <section className="mt-6">
        {tab === "requests" ? renderRequests(incoming, true) : null}
        {tab === "sent" ? renderRequests(sent, false) : null}
        {tab === "connections"
          ? renderProfiles(myConnections, (profileId) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  notifyAction(() => removeProfileConnection(profileId), "Connection removed")
                }
              >
                Remove
              </Button>
            ))
          : null}
        {tab === "following"
          ? renderProfiles(following, (profileId) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  notifyAction(() => toggleProfileFollow(profileId), "Profile unfollowed")
                }
              >
                Unfollow
              </Button>
            ))
          : null}
        {tab === "followers"
          ? renderProfiles(followers, (profileId) =>
              areProfilesConnected(db, actorId, profileId) ? (
                <span className="self-center text-xs font-semibold text-muted-foreground">
                  Connected
                </span>
              ) : null,
            )
          : null}
        {tab === "saved"
          ? renderProfiles(savedProfiles, (profileId) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  notifyAction(
                    () => toggleSavedProfile(profileId),
                    "Profile removed from saved",
                  )
                }
              >
                Remove saved
              </Button>
            ))
          : null}
        {tab === "blocked"
          ? renderProfiles(blocked, (profileId) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() => notifyAction(() => unblockProfile(profileId), "Profile unblocked")}
              >
                Unblock
              </Button>
            ))
          : null}
      </section>
    </Page>
  );
}
