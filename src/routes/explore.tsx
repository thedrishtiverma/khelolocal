import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, MapPin, Trophy, Users } from "lucide-react";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { Page, PrototypeDataNotice, SectionHeading, Stat } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { SportIcon } from "@/components/shared/SportIcon";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { Button } from "@/components/ui/button";
import { useKhelo } from "@/lib/services/store";
import { effectiveTournamentStatus, isAthletePubliclyDiscoverable } from "@/lib/services/selectors";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore local sport | KheloLocal" },
      {
        name: "description",
        content:
          "Discover Indore tournaments, athletes, sports, teams and verified local opportunities.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { db } = useKhelo();
  const tournaments = db.tournaments
    .filter((item) => {
      const status = effectiveTournamentStatus(item);
      return status === "LIVE" || status === "REGISTRATION_OPEN" || status === "UPCOMING";
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 3);
  const athletes = db.athletes
    .filter((item) => isAthletePubliclyDiscoverable(item) && item.verificationStatus === "VERIFIED")
    .slice(0, 3);
  const sports = db.sports.slice(0, 6);
  const organizers = db.organizers.slice(0, 3);
  const startingPoints = [
    [MapPin, "Sports map", "Focus on local activity and reveal what is happening nearby.", "/map"],
    [Trophy, "Tournaments", "Find live, open and upcoming competitions across the network.", "/tournaments"],
    [Users, "Athletes", "Meet players by sport, position and verified record.", "/athletes"],
    [Building2, "Institutions", "See the colleges and organizations building sporting history.", "/institutions"],
  ] as const;

  return (
    <div>
      <NetworkHero
        tone="explore"
        eyebrow="Explore KheloLocal"
        title={
          <>
            A local sports network with <span className="text-lime">national ambition.</span>
          </>
        }
        description="Start with a complete view of your local scene, then move into the map, the tournament calendar, athlete records and the people organizing it all."
        highlights={["Find a game", "Meet players", "Build a record"]}
        actions={
          <Button asChild size="lg">
            <Link to="/map">
              Open the network map <MapPin className="size-4" />
            </Link>
          </Button>
        }
      />
      <Page className="py-12 sm:py-20">
        <PrototypeDataNotice className="mb-5" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={db.tournaments.length} label="Tournaments" />
          <Stat value={db.athletes.length} label="Athletes" />
          <Stat value={db.teams.length} label="Local teams" />
          <Stat
            tone="accent"
            value={db.achievements.filter((item) => item.verified).length}
            label="Verified records"
          />
        </div>
        <section className="mt-16">
          <SectionHeading
            eyebrow="Choose your starting point"
            title={
              <>
                Explore the <span className="text-lime">local network</span>
              </>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {startingPoints.map(([Icon, title, body, to]) => (
              <Link key={title} to={to} className="data-card group rounded-2xl p-6">
                <Icon className="size-6 text-lime" />
                <h2 className="mt-8 font-display text-2xl font-black uppercase transition-colors group-hover:text-lime">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                <ArrowRight className="mt-6 size-4 text-lime transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-16">
          <SectionHeading
            eyebrow="Play now"
            title={
              <>
                Featured <span className="text-lime">tournaments</span>
              </>
            }
            action={
              <Link to="/tournaments" className="text-sm font-bold hover:text-lime">
                All tournaments <ArrowRight className="inline size-4" />
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {tournaments.map((item) => (
              <TournamentCard key={item.id} tournament={item} />
            ))}
          </div>
        </section>
        <section className="mt-16">
          <SectionHeading
            eyebrow="Find your people"
            title={
              <>
                Verified <span className="text-lime">athletes near you</span>
              </>
            }
            action={
              <Link to="/athletes" className="text-sm font-bold hover:text-lime">
                All athletes <ArrowRight className="inline size-4" />
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {athletes.map((item) => (
              <AthleteCard key={item.id} athlete={item} />
            ))}
          </div>
        </section>
        <section className="mt-16">
          <SectionHeading
            eyebrow="Pick a game"
            title={
              <>
                Sports with a <span className="text-lime">local signal</span>
              </>
            }
            action={
              <Link to="/sports" className="text-sm font-bold hover:text-lime">
                All sports <ArrowRight className="inline size-4" />
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                to="/sports/$sport"
                params={{ sport: sport.id }}
                className="sport-discovery-card rounded-xl border border-border bg-card p-5 transition-colors hover:border-lime"
              >
                <SportIcon sportId={sport.id} className="size-6 text-lime" />
                <h2 className="sport-discovery-name mt-5 font-display text-lg font-bold uppercase transition-colors">
                  {sport.name}
                </h2>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-16">
          <SectionHeading
            eyebrow="The people behind the fixtures"
            title={
              <>
                Organizations <span className="text-lime">in Indore.</span>
              </>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {organizers.map((organizer) => (
              <article key={organizer.id} className="data-card rounded-xl p-6">
                <BadgeCheck className="size-5 text-verified" />
                <h2 className="mt-6 font-display text-2xl font-bold uppercase">
                  {organizer.organizationName}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {organizer.organizationType} · {organizer.cityName}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {organizer.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Page>
    </div>
  );
}
