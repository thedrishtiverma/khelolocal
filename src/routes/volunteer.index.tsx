import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/volunteer/")({
  head: () => ({
    meta: [
      { title: "Volunteer with KheloLocal" },
      {
        name: "description",
        content: "Help map and verify grassroots sport in your neighbourhood.",
      },
    ],
  }),
  component: VolunteerPage,
});

const STEPS = [
  [
    MapPin,
    "Spot local sport",
    "Find the grounds, events, academies and opportunities people should know about.",
  ],
  [
    ClipboardCheck,
    "Add the details",
    "Share what is happening on the ground with a simple, guided field report.",
  ],
  [
    ShieldCheck,
    "Help verify",
    "Give every player a clearer, more trustworthy local sports network.",
  ],
] as const;

function VolunteerPage() {
  return (
    <div>
      <NetworkHero
        tone="volunteer"
        eyebrow="KheloLocal volunteers"
        title={
          <>
            Know your neighbourhood? <span className="text-lime">Put sport on the map.</span>
          </>
        }
        description="Join the people documenting grassroots sport, one local court, tournament and opportunity at a time."
        highlights={["Your zone", "Field reports", "Real impact"]}
        actions={
          <Button asChild size="lg">
            <Link to="/signup">
              Become a volunteer <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <Page className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="A stronger sporting city"
          title="Local knowledge makes the network work."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map(([Icon, title, body], index) => (
            <article key={title} className="data-card rounded-2xl p-6">
              <span className="font-num text-sm text-lime">0{index + 1}</span>
              <Icon className="mt-7 size-7 text-lime" />
              <h2 className="mt-6 font-display text-2xl font-black uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <section className="mt-16 flex flex-col gap-6 rounded-2xl border border-border bg-secondary/45 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <UsersRound className="size-7 text-lime" />
            <h2 className="mt-4 font-display text-3xl font-black uppercase">
              Already on the field?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Volunteer accounts can submit and track verified local sports information from their
              assigned zone.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/volunteer/desk">Open field desk</Link>
          </Button>
        </section>
      </Page>
    </div>
  );
}
