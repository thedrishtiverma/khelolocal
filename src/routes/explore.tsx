import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, Trophy, Users } from "lucide-react";
import { Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Button } from "@/components/ui/button";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore local sport | KheloLocal" },
      {
        name: "description",
        content:
          "Discover tournaments, athletes, sports and verified sporting opportunities around Indore.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { db } = useKhelo();
  const tournaments = db.tournaments
    .filter((t) => t.status === "LIVE" || t.status === "REGISTRATION_OPEN")
    .slice(0, 3);
  const athletes = db.athletes.filter((a) => a.verificationStatus === "VERIFIED").slice(0, 3);
  const sports = db.sports.slice(0, 6);
  const upcoming = db.tournaments
    .filter((t) => t.status === "UPCOMING" || t.status === "REGISTRATION_OPEN")
    .slice(0, 3);
  const verifiedAchievements = db.achievements.filter((a) => a.verified).slice(0, 3);

  return (
    <div>
      <NetworkHero
        tone="explore"
        eyebrow="Explore Indore"
        title={
          <>
            Your city is full of talent. <span className="text-lime">Find them all here.</span>
          </>
        }
        description="Discover tournaments, athletes, teams and sporting opportunities around you."
        highlights={["Find a game", "Meet players", "Build a record"]}
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/sports">
                Explore sports <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="network-hero-secondary-action"
            >
              <Link to="/tournaments/create">Create a tournament</Link>
            </Button>
          </>
        }
      />
      <Page className="py-14 sm:py-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={db.tournaments.length} label="Tournaments" />
          <Stat value={db.athletes.length} label="Athletes" />
          <Stat value={db.teams.length} label="Local teams" />
          <Stat
            tone="accent"
            value={db.achievements.filter((a) => a.verified).length}
            label="Verified achievements"
          />
        </div>
        <div className="mt-16">
          <SectionHeading
            eyebrow="Play now"
            title="Featured tournaments"
            action={
              <Button asChild variant="outline">
                <Link to="/tournaments">All tournaments</Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        </div>
        <div className="mt-16">
          <SectionHeading
            eyebrow="Close to home"
            title="Tournaments near you"
            action={
              <Link to="/map" className="text-sm font-bold hover:text-lime">
                View sports map
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {upcoming.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        </div>
        <div className="mt-16">
          <SectionHeading
            eyebrow="Find your people"
            title="Athletes near you"
            action={
              <Button asChild variant="outline">
                <Link to="/athletes">All athletes</Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-3">
            {athletes.map((a) => (
              <AthleteCard key={a.id} athlete={a} />
            ))}
          </div>
        </div>
        <div className="mt-16">
          <SectionHeading eyebrow="Choose a lane" title="Popular sports" />
          <div className="grid gap-3 sm:grid-cols-3">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                to="/sports/$sport"
                params={{ sport: sport.id }}
                className="data-card-muted rounded-xl border border-border p-5 hover:border-lime"
              >
                <Trophy className="size-5 text-lime" />
                <h3 className="mt-5 font-display text-xl font-bold uppercase">{sport.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find {sport.name.toLowerCase()} in Indore
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <SectionHeading eyebrow="The local network" title="Institutions building sport" />
          <div className="grid gap-4 md:grid-cols-3">
            {db.colleges.map((college) => (
              <Link key={college.id} to="/institutions" className="data-card rounded-xl p-6">
                <BadgeCheck className="size-5 text-lime" />
                <h2 className="mt-6 font-display text-2xl font-bold uppercase">
                  {college.shortName}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{college.sportsEventName}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <SectionHeading eyebrow="This week" title="Upcoming events" />
          <div className="grid gap-4 md:grid-cols-3">
            {upcoming.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        </div>
        <div className="mt-16">
          <SectionHeading eyebrow="Proof matters" title="Recently verified achievements" />
          <div className="grid gap-4 md:grid-cols-3">
            {verifiedAchievements.map((achievement) => (
              <Link
                key={achievement.id}
                to="/athletes/$id"
                params={{ id: achievement.athleteId }}
                className="data-card rounded-xl p-6"
              >
                <BadgeCheck className="size-5 text-verified" />
                <h2 className="mt-6 font-display text-xl font-bold uppercase">
                  {achievement.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{achievement.description}</p>
                <p className="mt-4 text-xs font-semibold text-verified">
                  Verified by {achievement.verifiedBy}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <Link to="/map" className="data-card rounded-xl p-6">
            <MapPin className="size-5 text-lime" />
            <h2 className="mt-6 font-display text-2xl font-bold uppercase">Sports map</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore verified venues and opportunities by zone.
            </p>
          </Link>
          <Link to="/stories" className="data-card rounded-xl p-6">
            <Users className="size-5 text-lime" />
            <h2 className="mt-6 font-display text-2xl font-bold uppercase">Community stories</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Meet the people making local sport happen.
            </p>
          </Link>
          <Link to="/verification" className="data-card rounded-xl p-6">
            <BadgeCheck className="size-5 text-lime" />
            <h2 className="mt-6 font-display text-2xl font-bold uppercase">Verified records</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              See how results become trusted sporting identity.
            </p>
          </Link>
        </div>
      </Page>
    </div>
  );
}
