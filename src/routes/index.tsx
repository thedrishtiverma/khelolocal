import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, Search, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KheloLocal — Your city's sports network" },
      {
        name: "description",
        content:
          "Discover athletes, find local tournaments and build a verified sporting identity. Starting in Indore.",
      },
      { property: "og:title", content: "KheloLocal — Your city's sports network" },
      {
        property: "og:description",
        content: "Discover athletes. Find tournaments. Build your sporting identity.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { n: "01", title: "Participate", body: "Find and join local tournaments." },
  { n: "02", title: "Record", body: "Matches generate structured sporting data." },
  { n: "03", title: "Verify", body: "Organizers confirm results and achievements." },
  { n: "04", title: "Discover", body: "Verified sporting identities become discoverable." },
];

function Landing() {
  const { db } = useKhelo();
  const featured = db.tournaments
    .filter((t) => t.status === "LIVE" || t.status === "REGISTRATION_OPEN")
    .slice(0, 3);

  return (
    <div>
      <section className="surface-panel">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
            <MapPin className="size-3.5" /> Starting in Indore, MP
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            Your city's <span className="text-lime">sports</span> network.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-surface-foreground/80">
            Discover athletes. Find tournaments. Build your sporting identity.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-surface-foreground/60">
            KheloLocal connects the athletes, tournaments, organizers and teams that make grassroots
            sports happen.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/tournaments">
                Explore tournaments <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-surface-foreground hover:bg-white/10">
              <Link to="/organizer/create">Host a tournament</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-surface-foreground hover:bg-white/10">
              <Link to="/discover">Discover talent</Link>
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4">
            <Stat tone="invert" value={db.athletes.length} label="Athletes in Indore" />
            <Stat tone="invert" value={db.tournaments.length} label="Tournaments" />
            <Stat tone="invert" value={db.teams.length} label="Local teams" />
            <Stat
              tone="accent"
              value={db.achievements.filter((a) => a.verified).length}
              label="Verified achievements"
            />
          </div>
        </div>
      </section>

      <Page>
        <SectionHeading
          eyebrow="How it works"
          title="Participate → Record → Verify → Discover"
          subtitle="Tournaments are the engine. Verified results become an athlete's record."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-lg border border-border bg-card p-6">
              <p className="stat-num text-3xl text-lime">{s.n}</p>
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Page>

      <Page className="pt-0">
        <SectionHeading
          eyebrow="Sports near you"
          title="Live and open in Indore"
          action={
            <Button asChild variant="outline">
              <Link to="/tournaments">See all tournaments</Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </Page>

      <Page className="pt-0">
        <SectionHeading eyebrow="Built for" title="One network, three roles" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <Users className="size-5" />,
              title: "Athletes",
              body: "Join tournaments and turn every verified match into part of your record.",
              to: "/signup" as const,
              cta: "Create athlete profile",
            },
            {
              icon: <Trophy className="size-5" />,
              title: "Organizers",
              body: "Run tournaments, manage fixtures and verify results in one place.",
              to: "/organizer/create" as const,
              cta: "Host a tournament",
            },
            {
              icon: <Search className="size-5" />,
              title: "Teams & coaches",
              body: "Search local talent by sport, age, position and verified experience.",
              to: "/discover" as const,
              cta: "Find local talent",
            },
          ].map((c) => (
            <div key={c.title} className="flex flex-col rounded-lg border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded bg-secondary">
                {c.icon}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.body}</p>
              <Button asChild variant="secondary" className="mt-5">
                <Link to={c.to}>{c.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </Page>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Starting in Indore
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-black">
            Built locally. Designed to scale city by city.
          </h2>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeCheck className="size-4 text-verified" /> Results are verified by the organizer who
            ran the match — never self-reported.
          </p>
        </div>
      </section>
    </div>
  );
}
