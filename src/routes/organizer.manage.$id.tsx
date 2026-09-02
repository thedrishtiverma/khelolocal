import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, ListOrdered, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, Page, Stat } from "@/components/shared/Bits";
import { ResultBadge, StatusBadge } from "@/components/shared/Badges";
import { MatchScoringDialog } from "@/components/organizer/MatchScoringDialog";
import { VerifyDialog } from "@/components/organizer/VerifyDialog";
import { formatDate, formatDateRange } from "@/lib/format";
import { useKhelo } from "@/lib/services/store";
import {
  athleteById,
  matchesOfTournament,
  registrationsOfTournament,
  teamById,
  tournamentById,
} from "@/lib/services/selectors";
import type { Match } from "@/types";

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
  const { db, setRegistrationStatus, generateFixtures } = useKhelo();
  const [scoring, setScoring] = useState<Match | null>(null);
  const [verifying, setVerifying] = useState<Match | null>(null);
  const tournament = tournamentById(db, id);

  if (!tournament) {
    return (
      <Page>
        <EmptyState
          title="Tournament not found"
          action={
            <Button asChild>
              <Link to="/organizer">Back to dashboard</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const registrations = registrationsOfTournament(db, tournament.id);
  const matches = matchesOfTournament(db, tournament.id);
  const pendingVerification = matches.filter(
    (m) => m.status === "COMPLETED" && m.resultStatus === "PENDING",
  );

  return (
    <Page>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Managing
          </p>
          <h1 className="mt-1 font-display text-3xl font-black">{tournament.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tournament.sportName} · {formatDateRange(tournament.startDate, tournament.endDate)} ·{" "}
            {tournament.venue}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={tournament.status} />
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
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures & scoring</TabsTrigger>
          <TabsTrigger value="verify">Verify results</TabsTrigger>
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
                      <p className="font-semibold">{athlete?.name ?? "Unknown athlete"}</p>
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
                          onClick={() => {
                            setRegistrationStatus(r.id, "APPROVED");
                            toast.success("Registration approved");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRegistrationStatus(r.id, "REJECTED");
                            toast("Registration rejected");
                          }}
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
              <ListOrdered className="size-4" />
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
                    <Pencil className="size-4" />
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
                    <BadgeCheck className="size-4" />
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
