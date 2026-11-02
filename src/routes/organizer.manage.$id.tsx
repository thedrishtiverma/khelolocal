import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, KeywordHighlight, Page, Stat } from "@/components/shared/Bits";
import { ResultBadge, StatusBadge } from "@/components/shared/Badges";
import { ActivityIcon, StatusIcon } from "@/components/shared/KheloIcon";
import { MatchScoringDialog } from "@/components/organizer/MatchScoringDialog";
import { VerifyDialog } from "@/components/organizer/VerifyDialog";
import { formatDate, formatDateRange } from "@/lib/format";
import { useKhelo } from "@/lib/services/store";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { getTournamentById, getTournamentRegistrations } from "@/lib/services/tournament-backend";
import {
  athleteById,
  effectiveTournamentStatus,
  matchesOfTournament,
  registrationsOfTournament,
  teamById,
  tournamentById,
} from "@/lib/services/selectors";
import type { Match, Registration, Tournament } from "@/types";

export const Route = createFileRoute("/organizer/manage/$id")({
  head: () => ({
    meta: [
      { title: "Manage tournament | KheloLocal" },
      {
        name: "description",
        content:
          "Approve registrations, generate fixtures, enter scores and verify results for your tournament.",
      },
      { property: "og:title", content: "Manage tournament | KheloLocal" },
      { property: "og:description", content: "Fixtures, scoring and result verification." },
    ],
  }),
  component: ManageTournament,
});

function ManageTournament() {
  const { id } = Route.useParams();
  const { db, currentUser, hydrated, setRegistrationStatus, generateFixtures } = useKhelo();
  const [scoring, setScoring] = useState<Match | null>(null);
  const [verifying, setVerifying] = useState<Match | null>(null);
  const [reviewingRegistrationId, setReviewingRegistrationId] = useState<string | null>(null);
  const [remoteTournament, setRemoteTournament] = useState<Tournament | null>(null);
  const [remoteRegistrations, setRemoteRegistrations] = useState<Registration[]>([]);
  const [loadingRemoteData, setLoadingRemoteData] = useState(isSupabaseConfigured());
  const [remoteError, setRemoteError] = useState("");
  const localTournament = tournamentById(db, id);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoadingRemoteData(false);
      return;
    }

    let active = true;
    setLoadingRemoteData(true);
    setRemoteError("");
    void Promise.all([
      localTournament ? Promise.resolve(localTournament) : getTournamentById(id),
      getTournamentRegistrations(id),
    ])
      .then(([event, registrations]) => {
        if (!active) return;
        setRemoteTournament(event);
        setRemoteRegistrations(registrations);
      })
      .catch((error: unknown) => {
        if (active) {
          setRemoteError(
            error instanceof Error ? error.message : "Could not load tournament data.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingRemoteData(false);
      });

    return () => {
      active = false;
    };
  }, [id, localTournament]);

  const tournament = localTournament ?? remoteTournament;

  if (isSupabaseConfigured() && !hydrated) {
    return (
      <Page>
        <p className="py-12 text-center text-sm text-muted-foreground" role="status">
          Checking your account…
        </p>
      </Page>
    );
  }

  if (!tournament) {
    return (
      <Page>
        {loadingRemoteData ? (
          <p className="py-12 text-center text-sm text-muted-foreground" role="status">
            Loading tournament…
          </p>
        ) : (
          <EmptyState
            title={remoteError ? "Tournament could not be loaded." : "Tournament not found"}
            description={remoteError || undefined}
            action={
              <Button asChild>
                <Link to="/organizer">Back to dashboard</Link>
              </Button>
            }
          />
        )}
      </Page>
    );
  }

  if (
    isSupabaseConfigured() &&
    currentUser?.id !== tournament.organizerId &&
    currentUser?.role !== "ADMIN"
  ) {
    return (
      <Page>
        <EmptyState
          title="You cannot manage this tournament."
          description="Only its organizer or a platform administrator can manage registrations."
          action={
            <Button asChild>
              <Link to="/tournaments">Browse tournaments</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const registrations = isSupabaseConfigured()
    ? remoteRegistrations
    : registrationsOfTournament(db, tournament.id);
  const matches = matchesOfTournament(db, tournament.id);
  const pendingVerification = matches.filter(
    (m) => m.status === "COMPLETED" && m.resultStatus === "PENDING",
  );
  const reviewRegistration = async (registrationId: string, status: "APPROVED" | "REJECTED") => {
    setReviewingRegistrationId(registrationId);
    try {
      await setRegistrationStatus(registrationId, status);
      setRemoteRegistrations((previous) =>
        previous.map((registration) =>
          registration.id === registrationId ? { ...registration, status } : registration,
        ),
      );
      if (status === "APPROVED") toast.success("Registration approved");
      else toast("Registration rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update registration.");
    } finally {
      setReviewingRegistrationId(null);
    }
  };

  return (
    <Page>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Managing
          </p>
          <h1 className="mt-1 font-display text-3xl font-black">
            <KeywordHighlight text={tournament.name} />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tournament.sportName} · {formatDateRange(tournament.startDate, tournament.endDate)} ·{" "}
            {tournament.venue}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={effectiveTournamentStatus(tournament)} />
          <Button asChild variant="outline" size="sm">
            <Link to="/tournaments/$id" params={{ id: tournament.id }}>
              View public page
            </Link>
          </Button>
        </div>
      </div>

      <div className="surface-panel mt-6 grid grid-cols-2 gap-6 rounded-xl p-6 sm:grid-cols-4">
        <Stat tone="invert" value={registrations.length} label="Registrations" />
        <Stat tone="invert" value={matches.length} label="Fixtures" />
        <Stat
          tone="invert"
          value={matches.filter((m) => m.resultStatus === "VERIFIED").length}
          label="Verified results"
        />
        <Stat tone="accent" value={pendingVerification.length} label="Awaiting verification" />
      </div>

      <Tabs defaultValue="registrations" className="mt-8">
        <TabsList>
          <TabsTrigger value="registrations">
            <ActivityIcon activity="registration" className="mr-1.5 size-4" />
            Registrations
          </TabsTrigger>
          <TabsTrigger value="fixtures">
            <ActivityIcon activity="fixture" className="mr-1.5 size-4" />
            Fixtures & scoring
          </TabsTrigger>
          <TabsTrigger value="verify">
            <ActivityIcon activity="verification" className="mr-1.5 size-4" />
            Verify results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="mt-6">
          {registrations.length === 0 ? (
            <EmptyState title="No registrations yet." />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {registrations.map((r) => {
                const athlete = athleteById(db, r.athleteId);
                return (
                  <li key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                    <div className="min-w-48 flex-1">
                      <p className="font-semibold">
                        {athlete?.name ?? `Athlete ${r.athleteId.slice(0, 8)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {athlete?.position} · {athlete?.ageCategory} · applied{" "}
                        {formatDate(r.registrationDate)}
                      </p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {r.status}
                    </span>
                    {r.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={reviewingRegistrationId === r.id}
                          onClick={() => void reviewRegistration(r.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={reviewingRegistrationId === r.id}
                          onClick={() => void reviewRegistration(r.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="fixtures" className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Generate knockout fixtures from approved teams, then enter scores match by match.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                const created = generateFixtures(tournament.id);
                toast.success(
                  created > 0 ? `${created} fixtures generated` : "Fixtures already up to date",
                );
              }}
            >
              <ActivityIcon activity="fixture" className="size-4" />
              Generate fixtures
            </Button>
          </div>

          {matches.length === 0 ? (
            <EmptyState title="No fixtures yet." description="Generate fixtures to get started." />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {matches.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="min-w-56 flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <ActivityIcon
                        activity="match"
                        className="mr-1.5 inline size-4 align-text-bottom"
                      />
                      {m.round} · Match {m.matchNumber}
                    </p>
                    <p className="mt-1 font-semibold">
                      {teamById(db, m.teamAId)?.name} vs {teamById(db, m.teamBId)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(m.scheduledAt)} · {m.venue}
                    </p>
                  </div>
                  <span className="stat-num text-xl">
                    {m.teamAScore} – {m.teamBScore}
                  </span>
                  <ResultBadge status={m.resultStatus} />
                  <Button size="sm" variant="outline" onClick={() => setScoring(m)}>
                    <ActivityIcon activity="score" className="size-4" />
                    {m.status === "COMPLETED" ? "Edit score" : "Enter score"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="verify" className="mt-6">
          {pendingVerification.length === 0 ? (
            <EmptyState
              title="Nothing awaiting verification."
              description="Complete a match in Fixtures & scoring to unlock verification."
            />
          ) : (
            <ul className="space-y-4">
              {pendingVerification.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-lime/40 bg-lime/10 p-5"
                >
                  <div className="min-w-56 flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {m.round} · Match {m.matchNumber}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">
                      {teamById(db, m.teamAId)?.name} {m.teamAScore} – {m.teamBScore}{" "}
                      {teamById(db, m.teamBId)?.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Verifying publishes stats and achievements to every athlete's profile.
                    </p>
                  </div>
                  <Button onClick={() => setVerifying(m)}>
                    <StatusIcon status="verified" className="size-4" />
                    Verify result
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      {scoring ? (
        <MatchScoringDialog
          key={scoring.id}
          match={scoring}
          open
          onOpenChange={(v) => !v && setScoring(null)}
        />
      ) : null}
      {verifying ? (
        <VerifyDialog
          key={verifying.id}
          match={verifying}
          open
          onOpenChange={(v) => !v && setVerifying(null)}
        />
      ) : null}
    </Page>
  );
}
