import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Search, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "For coaches | KheloLocal" },
      {
        name: "description",
        content: "Find local athletes and teams by sport, position and verified experience.",
      },
    ],
  }),
  component: CoachesPage,
});

const WORKFLOW = [
  {
    icon: Search,
    title: "Find players",
    body: "Narrow athlete discovery by sport, position, institution and age category.",
  },
  {
    icon: ShieldCheck,
    title: "Review records",
    body: "Distinguish athlete-submitted claims from organizer- and institution-confirmed records.",
  },
  {
    icon: Users,
    title: "Build a shortlist",
    body: "Save relevant profiles and request a connection through the local network.",
  },
];

function CoachesPage() {
  return (
    <div>
      <NetworkHero
        tone="athletes"
        eyebrow="For coaches and teams"
        title={
          <>
            Find the right player. <span className="text-lime">Build the right team.</span>
          </>
        }
        description="Search local athletes by sport, position and verified experience, then explore the teams already playing in your city."
        highlights={["Athlete discovery", "Verified records", "Local teams"]}
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/athletes">
                Find athletes <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="network-hero-secondary-action">
              <Link to="/teams">Browse teams</Link>
            </Button>
          </>
        }
      />
      <Page className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="A clearer scouting workflow"
          title={
            <>
              From search to <span className="text-lime">connection.</span>
            </>
          }
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {WORKFLOW.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="data-card rounded-xl border-t-2 border-lime p-6">
              <span className="font-num text-sm text-lime">0{index + 1}</span>
              <Icon className="mt-6 size-6 text-lime" />
              <h2 className="mt-5 font-display text-xl font-bold uppercase">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Coaches, clubs and teams
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create a scout account to save profiles and request athlete connections.
            </p>
          </div>
          <Button asChild>
            <Link to="/signup">Join as a coach or team</Link>
          </Button>
        </div>
        <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <BadgeCheck className="size-4 text-verified" />
          Verification labels identify the source of a record; review each profile before making
          selection decisions.
        </div>
      </Page>
    </div>
  );
}