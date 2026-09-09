import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Shield, Trophy, Users } from "lucide-react";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/sports/$sport")({
  head: () => ({ meta: [{ title: "Sport in Indore | KheloLocal" }] }),
  component: SportHub,
});

function titleFor(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function SportHub() {
  const { sport } = Route.useParams();
  const { db } = useKhelo();
  const name = db.sports.find((item) => item.id === sport)?.name ?? titleFor(sport);
  const tournaments = db.tournaments.filter((item) => item.sportId === sport);
  const athletes = db.athletes.filter((item) => item.primarySport === sport);
  const teams = db.teams.filter((item) => item.sportId === sport);
  const organizers = db.organizers.filter((item) =>
    db.tournaments.some(
      (tournament) => tournament.organizerId === item.id && tournament.sportId === sport,
    ),
  );

  return (
    <Page className="py-14 sm:py-20">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">Sport × city</p>
      <h1 className="mt-5 font-display text-5xl font-black uppercase sm:text-7xl">
        {name} in Indore
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        The local network for {name.toLowerCase()}: players, competitions and the organizations
        behind them.
      </p>
      <section className="mt-16">
        <SectionHeading
          title={`${name} tournaments`}
          action={
            <Link to="/tournaments" className="text-sm font-bold hover:text-lime">
              All tournaments
            </Link>
          }
        />
        {tournaments.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {tournaments.map((item) => (
              <TournamentCard key={item.id} tournament={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${name.toLowerCase()} tournaments listed yet.`}
            description="Check back soon or create the first one for your city."
          />
        )}
      </section>
      <section className="mt-16">
        <SectionHeading title={`${name} athletes`} />
        {athletes.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {athletes.map((item) => (
              <AthleteCard key={item.id} athlete={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${name.toLowerCase()} athletes listed yet.`}
            description="Athlete profiles will appear here as the network grows."
          />
        )}
      </section>
      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Shield, `${name} teams`, teams.length, "/teams"],
          [Building2, `${name} institutions`, db.colleges.length, "/institutions"],
          [Users, `${name} organizers`, organizers.length, "/organizers"],
          [
            Trophy,
            `Recent ${name} results`,
            tournaments.filter((item) => item.status === "COMPLETED").length,
            "/tournaments",
          ],
        ].map(([Icon, title, count, to]) => (
          <Link
            key={title as string}
            to={to as "/teams"}
            className="data-card-muted rounded-xl border border-border p-6"
          >
            <Icon className="size-5 text-lime" />
            <p className="stat-num mt-8 text-3xl">{count as number}</p>
            <h2 className="mt-2 font-display text-xl font-bold uppercase">{title as string}</h2>
          </Link>
        ))}
      </section>
    </Page>
  );
}
