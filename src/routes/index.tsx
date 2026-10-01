import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, Search, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KheloLocal" },
      {
        name: "description",
        content:
          "KheloLocal connects athletes, organizers, institutions and teams in one verified local sports network.",
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
  return (
    <div>
      <NetworkHero
        tone="explore"
        eyebrow="KheloLocal"
        title={
          <>
            The local sports network for <span className="text-lime">everyday athletes.</span>
          </>
        }
        description="KheloLocal brings together players, tournaments, institutions and organizers in one trusted platform for discovering and building local sport."
        highlights={["Find a game", "Meet players", "Build a record"]}
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/tournaments">
                Find your next game <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="network-hero-secondary-action">
              <Link to="/athletes">Scout local talent</Link>
            </Button>
          </>
        }
      />

      <Page className="loop-section py-14 sm:py-20">
        <SectionHeading
          eyebrow="The KheloLocal loop"
          title={
            <>
              Play hard. <span className="text-lime">Leave a record.</span>
            </>
          }
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

      <section className="border-y border-border bg-secondary/35">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Built for
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl">
              <span className="text-accent">One network,</span>{" "}
              <span className="text-primary">four core roles.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Athletes, organizers, institutions, and teams each have a direct path into the local
              sporting network.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                icon: <Building2 className="size-5" />,
                title: "Institutions",
                body: "Verify campus results and give student athletes a lasting sports record.",
                to: "/institutions" as const,
                cta: "Explore institution tools",
              },
              {
                icon: <Search className="size-5" />,
                title: "Teams & coaches",
                body: "Search local talent by sport, age, position and verified experience.",
                to: "/coaches" as const,
                cta: "Explore coach tools",
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
              Built for every sporting community
            </p>
            <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] sm:text-6xl">
              Built locally.
              <br />
              <span className="text-lime">Designed to scale.</span>
            </h2>
          </div>
          <div className="border-l border-surface-foreground/20 pl-6 sm:pl-10">
            <p className="max-w-2xl text-xl leading-8 text-surface-foreground/85 sm:text-2xl sm:leading-9">
              City by city,{" "}
              <span className="font-display font-black tracking-tight">
                Khelo<span className="text-lime">Local</span>
              </span>{" "}
              turns everyday games into a trusted sporting network.
            </p>
            <p className="mt-6 flex max-w-xl items-start gap-3 text-sm leading-6 text-surface-foreground/60">
              <BadgeCheck className="mt-0.5 size-5 shrink-0 text-verified" />
              Organizer-confirmed results become verified records; athlete-submitted claims remain
              unverified until reviewed.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
              <span className="text-primary">Start here</span>
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-none sm:text-6xl">
              <span className="text-lime">One home ground.</span> Every way in.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Follow the path that fits you: learn the network, find the map, join a game, support
              the field, or explore what local communities are building.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "How it works",
                "See how a match becomes a trusted sporting record.",
                "/how-it-works",
              ],
              [
                "Our cities",
                "Explore the people and places building the network.",
                "/cities",
              ],
              ["Sports map", "Focus an area, then reveal its events and athletes.", "/map"],
              ["Sports", "Choose a game and find its local network.", "/sports"],
              [
                "Institutions",
                "See the colleges and sports cells building records.",
                "/institutions",
              ],
              ["For organizers", "Publish, manage and verify the next tournament.", "/organizers"],
              ["Volunteer", "Put the sport you know on the city map.", "/volunteer"],
              ["KheloLocal merch", "Carry the local game beyond the boundary.", "/shop"],
            ].map(([title, body, to]) => (
              <Link key={title} to={to as "/map"} className="data-card group rounded-xl p-5">
                <h3 className="font-display text-xl font-bold uppercase transition-colors group-hover:text-lime">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                <ArrowRight className="mt-5 size-4 text-lime transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
