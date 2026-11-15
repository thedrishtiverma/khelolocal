import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  Page,
  SectionHeading,
  Stat,
} from "@/components/shared/Bits";
import { ProfileBanner, ProfileContactLink } from "@/components/shared/ProfileBanner";
import { VerifiedBadge } from "@/components/shared/Badges";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { formatDate, sportLabel } from "@/lib/format";
import { useCurrentAthlete, useKhelo } from "@/lib/services/store";
import {
  achievementsOfAthlete,
  effectiveTournamentStatus,
  recordsOfAthlete,
  tournamentsOfAthlete,
} from "@/lib/services/selectors";
import { RecordCard } from "@/components/college/RecordCard";

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

function AthleteDashboard() {
  const { db, hydrated, currentUser } = useKhelo();
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
  const upcoming = myTournaments.filter((t) => {
    const status = effectiveTournamentStatus(t);
    return status !== "COMPLETED" && status !== "CANCELLED";
  });
  const recommended = db.tournaments
    .filter(
      (t) =>
        t.sportId === athlete.primarySport &&
        effectiveTournamentStatus(t) === "REGISTRATION_OPEN" &&
        !myTournaments.some((m) => m.id === t.id),
    )
    .slice(0, 3);
  const achievements = achievementsOfAthlete(db, athlete.id).slice(0, 4);
  const collegeRecords = recordsOfAthlete(db, athlete.id);

  return (
    <Page>
      <ProfileBanner
        name={athlete.name}
        image={athlete.profileImage}
        eyebrow="Verified sports identity"
        sportId={athlete.primarySport}
        subtitle={`${sportLabel(athlete.primarySport)} · ${athlete.position}${athlete.collegeName ? ` · ${athlete.collegeName}` : ""}`}
        meta={
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {athlete.cityName}
          </span>
        }
        status={athlete.verificationStatus === "VERIFIED" ? <VerifiedBadge /> : null}
        contacts={
          currentUser?.email ? (
            <ProfileContactLink
              href={`mailto:${currentUser.email}`}
              label={currentUser.email}
              icon={<Mail className="size-4 shrink-0" aria-hidden="true" />}
            />
          ) : null
        }
        actions={
          <Button asChild>
            <Link to="/athlete/profile">View full profile</Link>
          </Button>
        }
        role="athlete"
      />
      <section className="surface-panel mt-4 rounded-xl p-6 sm:p-8">
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-surface-foreground/15 pt-6 sm:grid-cols-4">
          <Stat tone="invert" value={athlete.tournamentsPlayed} label="Tournaments" />
          <Stat tone="invert" value={athlete.matchesPlayed} label="Matches" />
          <Stat tone="invert" value={athlete.wins} label="Wins" />
          <Stat tone="accent" value={athlete.verifiedAchievementsCount} label="Verified achievements" />
        </div>
      </section>

      <div className="mt-12">
        <SectionHeading
          compact
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
        <SectionHeading
          compact
          title="Local opportunities"
          subtitle="Open registrations for your sport in Indore."
        />
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
        <SectionHeading
          compact
          title="Your college record"
          subtitle="Past annual sports event performances, with their verification stage."
        />
        {collegeRecords.length === 0 ? (
          <EmptyState title="No college records yet." description="Your college can add past results from its record book." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {collegeRecords.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <SectionHeading compact title="Recent achievements" />
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