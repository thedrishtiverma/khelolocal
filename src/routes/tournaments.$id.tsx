import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ResultBadge, StatusBadge, VerifiedBadge } from "@/components/shared/Badges";
import { EmptyState, Page, Stat } from "@/components/shared/Bits";
import { formatDate, formatDateRange, formatDateTime, formatINR } from "@/lib/format";
import { useCurrentAthlete, useKhelo } from "@/lib/services/store";
import { matchesOfTournament, registrationsOfTournament, teamById } from "@/lib/services/selectors";

export const Route = createFileRoute("/tournaments/$id")({
  head: () => ({
    meta: [
      { title: "Tournament details | KheloLocal" },
      {
        name: "description",
        content:
          "Fixtures, teams, verified results and registration for local tournaments in Indore.",
      },
      { property: "og:title", content: "Tournament details | KheloLocal" },
      {
        property: "og:description",
        content: "Fixtures, teams and verified results for grassroots tournaments in Indore.",
      },
    ],
  }),
  component: TournamentDetails,
});

function TournamentDetails() {
  const { id } = Route.useParams();
  const { db, register, currentUser } = useKhelo();
  const athlete = useCurrentAthlete();
  const [tab, setTab] = useState("overview");

  const tournament = db.tournaments.find((t) => t.id === id);
  if (!tournament) throw notFound();

  const organizer = db.organizers.find((o) => o.id === tournament.organizerId);
  const regs = registrationsOfTournament(db, tournament.id);
  const matches = matchesOfTournament(db, tournament.id);
  const myReg = athlete ? regs.find((r) => r.athleteId === athlete.id) : undefined;
  const teams = Array.from(new Set(regs.filter((r) => r.teamId).map((r) => r.teamId as string)));

  const handleRegister = () => {
    if (!athlete) {
      toast.error("Log in as an athlete to register.");
      return;
    }
    register(tournament.id, athlete.id);
    toast.success("You're registered for this tournament.", {
      description: "The organizer will review your registration.",
    });
  };

  return (
    <div>
      <section className="surface-panel">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={tournament.status} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-surface-foreground/60">
              {tournament.sportName} · {tournament.ageCategory} · {tournament.format}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-black uppercase sm:text-5xl">
            {tournament.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-surface-foreground/75">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {tournament.venue}, {tournament.cityName}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />{" "}
              {formatDateRange(tournament.startDate, tournament.endDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="size-4" /> {formatINR(tournament.prizePool)}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-surface-foreground/60">Organized by</span>
            <span className="font-semibold">{organizer?.organizationName}</span>
            {organizer?.verificationStatus === "VERIFIED" ? (
              <VerifiedBadge label="Verified organizer" />
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {myReg ? (
              <span className="rounded-md border border-lime/40 bg-lime/15 px-4 py-2 text-sm font-semibold text-lime">
                Registered · {myReg.status.toLowerCase()}
              </span>
            ) : (
              <Button size="lg" onClick={handleRegister}>
                Register now
              </Button>
            )}
            {!currentUser ? (
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="text-surface-foreground hover:bg-white/10"
              >
                <Link to="/login">Log in to register</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <Page>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-bold">About this tournament</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {tournament.description}
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Venue", `${tournament.venue}, ${tournament.address}`],
                  ["Registration deadline", formatDate(tournament.registrationDeadline)],
                  ["Age category", tournament.ageCategory],
                  ["Gender category", tournament.genderCategory],
                  ["Format", tournament.format],
                  [
                    "Entry fee",
                    tournament.registrationFee
                      ? formatINR(tournament.registrationFee)
                      : "Free entry",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border border-border bg-background p-3">
                    <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold">Participation</h2>
                <div className="mt-4 flex items-end justify-between">
                  <Stat
                    value={`${tournament.currentParticipants}/${tournament.maxParticipants}`}
                    label="Participants"
                  />
                  <Users className="size-6 text-muted-foreground" />
                </div>
                <Progress
                  className="mt-4"
                  value={(tournament.currentParticipants / tournament.maxParticipants) * 100}
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold">Prize pool</h2>
                <p className="stat-num mt-3 text-4xl text-lime">
                  {formatINR(tournament.prizePool)}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            {teams.length === 0 ? (
              <EmptyState title="No teams registered yet." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((teamId) => {
                  const team = teamById(db, teamId);
                  if (!team) return null;
                  return (
                    <div key={teamId} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="font-display text-lg font-bold">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {team.sportName} · {team.cityName}
                      </p>
                      <ul className="mt-3 space-y-1 text-sm">
                        {team.players.map((pid) => {
                          const a = db.athletes.find((x) => x.id === pid);
                          if (!a) return null;
                          return (
                            <li key={pid}>
                              <Link
                                to="/athletes/$id"
                                params={{ id: a.id }}
                                className="hover:underline"
                              >
                                {a.name}
                              </Link>
                              <span className="text-muted-foreground"> · {a.position}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fixtures" className="mt-6">
            {matches.length === 0 ? (
              <EmptyState title="Fixtures haven't been published yet." />
            ) : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5"
                  >
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        {m.round} · Match {m.matchNumber}
                      </p>
                      <p className="mt-1 font-display text-lg font-bold">
                        {teamById(db, m.teamAId)?.name}{" "}
                        <span className="text-muted-foreground">vs</span>{" "}
                        {teamById(db, m.teamBId)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(m.scheduledAt)} · {m.venue}
                      </p>
                    </div>
                    <div className="text-right">
                      {m.status === "COMPLETED" ? (
                        <p className="stat-num text-2xl">
                          {m.teamAScore} – {m.teamBScore}
                        </p>
                      ) : (
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {m.status}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {matches.filter((m) => m.resultStatus === "VERIFIED").length === 0 ? (
              <EmptyState title="No verified results yet." />
            ) : (
              <div className="space-y-3">
                {matches
                  .filter((m) => m.resultStatus === "VERIFIED")
                  .map((m) => {
                    const perfs = db.playerPerformances.filter((p) => p.matchId === m.id);
                    return (
                      <div key={m.id} className="rounded-lg border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-display text-lg font-bold">
                            {teamById(db, m.teamAId)?.name} {m.teamAScore} – {m.teamBScore}{" "}
                            {teamById(db, m.teamBId)?.name}
                          </p>
                          <ResultBadge status={m.resultStatus} />
                        </div>
                        {perfs.length ? (
                          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                            {perfs.map((p) => {
                              const a = db.athletes.find((x) => x.id === p.athleteId);
                              return (
                                <li key={p.id}>
                                  <span className="font-semibold text-foreground">{a?.name}</span>{" "}
                                  {p.goals ? `· ${p.goals} goals ` : ""}
                                  {p.assists ? `· ${p.assists} assists ` : ""}
                                  {p.playerOfMatch ? "· Player of the Match" : ""}
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Page>
    </div>
  );
}
