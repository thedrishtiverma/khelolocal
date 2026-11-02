import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Handshake, MapPin } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/team/story")({
  head: () => ({
    meta: [
      { title: "Our story | KheloLocal" },
      {
        name: "description",
        content:
          "The story behind KheloLocal and the team building a network for grassroots sport.",
      },
    ],
  }),
  component: TeamStoryPage,
});

const STORY_STEPS = [
  {
    icon: MapPin,
    title: "Start with local sport",
    body: "Every city has games, competitions and communities worth discovering. KheloLocal starts by bringing those existing activities into view.",
  },
  {
    icon: Handshake,
    title: "Connect the people around the game",
    body: "Athletes, organizers, teams, coaches and institutions each hold part of the story. A shared network helps them find one another and contribute.",
  },
  {
    icon: Compass,
    title: "Make the next step easier to find",
    body: "When participation and results are easier to discover and understand, local sport can create clearer paths to connection and opportunity.",
  },
];

function TeamStoryPage() {
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="Our story"
        title={
          <>
            Local sport deserves <span className="text-lime">to be seen.</span>
          </>
        }
        description="KheloLocal began with a simple observation: games happen every day, but the people and moments behind them can be hard to find and remember."
        highlights={["Local games", "Connected people", "More opportunity"]}
      />
      <Page className="py-14 sm:py-20">
        <section className="grid gap-8 border-b border-border pb-12 sm:grid-cols-[0.7fr_1.3fr] sm:gap-12 sm:pb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">
              The starting point
            </p>
            <h2 className="mt-4 font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
              One city. A simple idea.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
            <p>
              KheloLocal was built by people who saw a gap between the games happening in local
              communities and the systems that could recognize them. Too often, a performance,
              result or moment of participation stays known only to the people who were there.
            </p>
            <p>
              We are building a connected home for those sporting journeys: a place where athletes
              can build a record, organizers can bring competitions into view, and teams, coaches
              and institutions can connect around local sport.
            </p>
            <p>
              The aim is to help everyday participation become visible, trusted and useful—so the
              next opportunity is easier to discover.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="What guides us"
            title={
              <>
                Build around the <span className="text-lime">game and its people.</span>
              </>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {STORY_STEPS.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className="data-card rounded-xl border-t-2 border-t-lime p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-lime" />
                  <span className="font-num text-xs font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-5 border-t border-border pt-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              The people behind it
            </p>
            <p className="mt-2 text-lg font-semibold">Meet the team building KheloLocal.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/team">
              Meet the team <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </Page>
    </div>
  );
}
