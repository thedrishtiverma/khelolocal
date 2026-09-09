import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, ChevronRight, MapPin, Search, Trophy, Users } from "lucide-react";
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
  {
    n: "01",
    title: "Participate",
    body: "Find and join local tournaments.",
    chip: "bg-secondary text-foreground",
    ring: "border-border",
  },
  {
    n: "02",
    title: "Record",
    body: "Matches generate structured sporting data.",
    chip: "bg-secondary text-foreground",
    ring: "border-border",
  },
  {
    n: "03",
    title: "Verify",
    body: "Organizers confirm results and achievements.",
    chip: "bg-verified/15 text-verified",
    ring: "border-verified/35",
  },
  {
    n: "04",
    title: "Discover",
    body: "Verified sporting identities become discoverable.",
    chip: "bg-primary text-primary-foreground",
    ring: "border-primary/35",
  },
];

function Landing() {
  const { db } = useKhelo();
  const featured = db.tournaments
    .filter((t) => t.status === "LIVE" || t.status === "REGISTRATION_OPEN")
    .slice(0, 3);
  const liveTournament = featured[0];

  return (
    <div>
      <section className="hero-stage surface-panel field-grid">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="relative z-10">
            <p className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
              <span className="live-dot" /> Live from Indore, Madhya Pradesh
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl">
              Your city is <span className="text-lime">playing.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-surface-foreground/72 sm:text-lg">
              The verified home ground for athletes, tournaments and the people who make local sport happen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group">
                <Link to="/tournaments">
                  Find your next game <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-surface-foreground/25 bg-transparent text-surface-foreground hover:bg-surface-foreground/10">
                <Link to="/discover">Scout local talent</Link>
              </Button>
            </div>
          </div>

          <div className="scoreboard-panel relative z-10 overflow-hidden rounded-xl border border-surface-foreground/15 bg-surface-foreground/6 p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between border-b border-surface-foreground/15 pb-5">
              <div><p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-surface-foreground/55">KheloLocal / Match centre</p><p className="mt-2 font-display text-2xl font-bold uppercase">On the ground</p></div>
              <span className="rounded-full bg-live/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-live">Live</span>
            </div>
            <div className="py-7">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-lime">Featured fixture</p>
              <p className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">{liveTournament?.sportName ?? "Local sport"}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-surface-foreground/65"><MapPin className="size-4 text-lime" />{liveTournament?.venue ?? "Indore sports grounds"}</div>
              <div className="mt-2 flex items-center gap-3 text-sm text-surface-foreground/65"><CalendarDays className="size-4 text-lime" />{liveTournament?.name ?? "Open registration now"}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-surface-foreground/15 pt-5">
              <div><p className="font-num text-2xl font-bold">{liveTournament?.currentParticipants ?? 0}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-surface-foreground/50">Players in</p></div>
              <div><p className="font-num text-2xl font-bold text-lime">{liveTournament?.maxParticipants ?? 0}</p><p className="mt-1 text-[10px] uppercase tracking-widest text-surface-foreground/50">Total slots</p></div>
            </div>
            <Link to="/tournaments" className="mt-6 flex items-center justify-between border-t border-surface-foreground/15 pt-4 text-xs font-bold uppercase tracking-widest text-lime hover:text-surface-foreground">
              See all fixtures <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scoreboard strip — the one place the cream brand tone is used. */}
      <section className="cream-band border-y border-border">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-7 sm:grid-cols-4 sm:px-6">
          <Stat value={db.athletes.length} label="Athletes in Indore" />
          <Stat value={db.tournaments.length} label="Tournaments" />
          <Stat value={db.teams.length} label="Local teams" />
          <Stat
            tone="accent"
            value={db.achievements.filter((a) => a.verified).length}
            label="Verified achievements"
          />
        </div>
      </section>

      <Page className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="The KheloLocal loop"
          title="Play hard. Leave a record."
          subtitle="Every match is a chance to make your sporting identity more visible."
        />
        <div className="relative">
          {/* connecting line — the pipeline, not four separate boxes */}
          <div className="pointer-events-none absolute left-0 right-0 top-11 hidden h-px bg-border lg:block" />
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className={`rounded-lg border bg-card p-6 theme-fade ${step.ring}`}
              >
                <span
                  className={`font-num inline-flex size-9 items-center justify-center rounded-full text-sm font-bold ${step.chip}`}
                >
                  {step.n}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Page>

      <Page className="pt-0 pb-14 sm:pb-20">
        <SectionHeading
          eyebrow="The local calendar"
          title="Your next game is closer than you think"
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
