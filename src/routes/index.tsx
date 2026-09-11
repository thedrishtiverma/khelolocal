import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  MapPin,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KheloLocal" },
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
        <div className="hero-orbit" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="relative z-10">
            <p className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
              <span className="live-dot" /> Live from Indore, Madhya Pradesh
            </p>
            <h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl">
              Your city's sports <span className="text-lime">network.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-surface-foreground/72 sm:text-lg">
              The verified home ground for athletes, tournaments and the people who make local sport
              happen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group">
                <Link to="/tournaments">
                  Find your next game{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-surface-foreground/25 bg-transparent text-surface-foreground hover:bg-surface-foreground/10"
              >
                <Link to="/athletes">Scout local talent</Link>
              </Button>
            </div>
          </div>

          <div className="scoreboard-panel relative z-10 overflow-hidden rounded-xl border border-surface-foreground/15 bg-surface-foreground/6 p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between border-b border-surface-foreground/15 pb-5">
              <div>
                <p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-surface-foreground/55">
                  KheloLocal / Match centre
                </p>
                <p className="mt-2 font-display text-2xl font-bold uppercase">On the ground</p>
              </div>
              <span className="rounded-full bg-live/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-live">
                Live
              </span>
            </div>
            <div className="py-7">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
                Featured fixture
              </p>
              <p className="mt-2 font-display text-4xl font-black uppercase leading-none sm:text-5xl">
                {liveTournament?.sportName ?? "Local sport"}
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm text-surface-foreground/65">
                <MapPin className="size-4 text-lime" />
                {liveTournament?.venue ?? "Indore sports grounds"}
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-surface-foreground/65">
                <CalendarDays className="size-4 text-lime" />
                {liveTournament?.name ?? "Open registration now"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-surface-foreground/15 pt-5">
              <div>
                <p className="font-num text-2xl font-bold">
                  {liveTournament?.currentParticipants ?? 0}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-surface-foreground/50">
                  Players in
                </p>
              </div>
              <div>
                <p className="font-num text-2xl font-bold text-lime">
                  {liveTournament?.maxParticipants ?? 0}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-surface-foreground/50">
                  Total slots
                </p>
              </div>
            </div>
            <Link
              to="/tournaments"
              className="mt-6 flex items-center justify-between border-t border-surface-foreground/15 pt-4 text-xs font-bold uppercase tracking-widest text-lime hover:text-surface-foreground"
            >
              See all fixtures <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="cream-band city-pulse-band border-y border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:py-9">
          <div className="shrink-0 lg:w-44">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-cream-foreground/55">
              Indore / 01
            </p>
            <p className="mt-2 font-display text-2xl font-black uppercase leading-none">
              City pulse
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 divide-x divide-y divide-cream-foreground/15 border-y border-cream-foreground/15 sm:grid-cols-4 sm:divide-y-0 sm:border-y-0">
            <Stat
              className="px-4 py-4 sm:px-5 sm:py-1"
              value={db.athletes.length}
              label="Athletes"
            />
            <Stat
              className="px-4 py-4 sm:px-5 sm:py-1"
              value={db.tournaments.length}
              label="Tournaments"
            />
            <Stat
              className="px-4 py-4 sm:px-5 sm:py-1"
              value={db.teams.length}
              label="Local teams"
            />
            <Stat
              className="px-4 py-4 sm:px-5 sm:py-1"
              tone="accent"
              value={db.achievements.filter((a) => a.verified).length}
              label="Verified achievements"
            />
          </div>
        </div>
      </section>

      <Page className="loop-section py-14 sm:py-20">
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
                className={`loop-step rounded-lg border bg-card p-6 theme-fade ${step.ring}`}
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

      <section className="border-y border-border bg-secondary/35">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Built for
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl">
              One network, three roles.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Everyone gets a clearer way to participate, organize, or find the next player who
              belongs on their team.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
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
                to: "/tournaments/create" as const,
                cta: "Host a tournament",
              },
              {
                icon: <Search className="size-5" />,
                title: "Teams & coaches",
                body: "Search local talent by sport, age, position and verified experience.",
                to: "/athletes" as const,
                cta: "Find local talent",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex min-h-72 flex-col border-t-2 border-foreground/15 bg-card p-7 transition-colors hover:border-lime sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {c.icon}
                </span>
                <h3 className="mt-7 font-display text-2xl font-bold uppercase">{c.title}</h3>
                <p className="mt-3 flex-1 max-w-xs text-sm leading-6 text-muted-foreground">
                  {c.body}
                </p>
                <Button asChild variant="link" className="mt-7 w-fit px-0 font-bold">
                  <Link to={c.to}>{c.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
              Starting in Indore
            </p>
            <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] sm:text-6xl">
              Built locally.
              <br />
              Designed to scale.
            </h2>
          </div>
          <div className="border-l border-surface-foreground/20 pl-6 sm:pl-10">
            <p className="max-w-2xl text-xl leading-8 text-surface-foreground/85 sm:text-2xl sm:leading-9">
              City by city, KheloLocal turns everyday games into a trusted sporting network.
            </p>
            <p className="mt-6 flex max-w-xl items-start gap-3 text-sm leading-6 text-surface-foreground/60">
              <BadgeCheck className="mt-0.5 size-5 shrink-0 text-verified" />
              Results are verified by the organizer who ran the match, never self-reported.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
