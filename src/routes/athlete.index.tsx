import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { VerifiedBadge } from "@/components/shared/Badges";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { formatDate } from "@/lib/format";
import { useCurrentAthlete, useKhelo } from "@/lib/services/store";
import { achievementsOfAthlete, tournamentsOfAthlete } from "@/lib/services/selectors";

export const Route = createFileRoute("/athlete/")({
  head: () => ({
    meta: [
      { title: "Athlete home | KheloLocal" },
      {
        name: "description",
        content: "Your verified sporting identity, upcoming tournaments and recent achievements.",
      },
      { property: "og:title", content: "Athlete home | KheloLocal" },
      { property: "og:description", content: "Track your matches, wins and verified achievements." },
    ],
  }),
  component: AthleteDashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function AthleteDashboard() {
  const { db, hydrated } = useKhelo();
  const athlete = useCurrentAthlete();

  if (!athlete) {
    return (
      <Page>
        <EmptyState
          title={hydrated ? "Log in as an athlete" : "Loading…"}
          description="Use the athlete demo account to see a verified sporting identity."
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const myTournaments = tournamentsOfAthlete(db, athlete.id);
  const upcoming = myTournaments.filter((t) => t.status !== "COMPLETED");
  const recommended = db.tournaments
    .filter(
      (t) =>
        t.sportId === athlete.primarySport &&
        t.status === "REGISTRATION_OPEN" &&
        !myTournaments.some((m) => m.id === t.id),
    )
    .slice(0, 3);
  const achievements = achievementsOfAthlete(db, athlete.id).slice(0, 4);

  return (
    <Page>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black sm:text-4xl">
          {greeting()}, {athlete.name.split(" ")[0]}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" /> {athlete.cityName}
        </p>
      </div>

      <section className="surface-panel rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-surface-foreground/60">
              Verified sports identity
            </p>
            <h2 className="mt-1 font-display text-2xl font-black">{athlete.name}</h2>
            <p className="text-sm text-surface-foreground/70">
              {athlete.primarySport === "football" ? "Football" : "Kabaddi"} · {athlete.position}
            </p>
          </div>
          {athlete.verificationStatus === "VERIFIED" ? <VerifiedBadge /> : null}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
          <Stat tone="invert" value={athlete.tournamentsPlayed} label="Tournaments" />
          <Stat tone="invert" value={athlete.matchesPlayed} label="Matches" />
          <Stat tone="invert" value={athlete.wins} label="Wins" />
          <Stat tone="accent" value={athlete.verifiedAchievementsCount} label="Verified achievements" />
        </div>
        <Button asChild className="mt-6" variant="secondary">
          <Link to="/athlete/profile">View full profile</Link>
        </Button>
      </section>

      <div className="mt-12">
        <SectionHeading
          title="Your upcoming tournaments"
          action={
            <Button asChild variant="outline">
              <Link to="/athlete/tournaments">My tournaments</Link>
            </Button>
          }
        />
        {upcoming.length === 0 ? (
          <EmptyState
            title="No upcoming tournaments."
            description="Find something to play in your city."
            action={
              <Button asChild>
                <Link to="/tournaments">Explore tournaments</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <SectionHeading title="Local opportunities" subtitle="Open registrations for your sport in Indore." />
        {recommended.length === 0 ? (
          <EmptyState title="Nothing open right now." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <SectionHeading title="Recent achievements" />
        {achievements.length === 0 ? (
          <EmptyState title="No achievements yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display font-bold">{a.title}</p>
                  {a.verified ? <VerifiedBadge /> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {db.tournaments.find((t) => t.id === a.tournamentId)?.name}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(a.date)} · Verified by {a.verifiedBy}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}