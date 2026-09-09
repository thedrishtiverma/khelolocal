import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Megaphone, Pencil, Trophy } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/organizers")({
  head: () => ({
    meta: [
      { title: "For organizers | KheloLocal" },
      {
        name: "description",
        content: "Publish tournaments, reach players and build a verified record with KheloLocal.",
      },
    ],
  }),
  component: OrganizersPage,
});

const WORKFLOW = [
  { icon: Pencil, title: "Publish", body: "Create and promote your tournament." },
  { icon: Megaphone, title: "Reach", body: "Get discovered by relevant athletes and teams." },
  {
    icon: Trophy,
    title: "Manage",
    body: "Keep participants, schedules and information organized.",
  },
  { icon: BadgeCheck, title: "Record", body: "Turn results into verified sporting achievements." },
];

function OrganizersPage() {
  return (
    <div>
      <NetworkHero
        tone="organizers"
        eyebrow="For organizers"
        title={
          <>
            Run your tournament. Reach your players.{" "}
            <span className="text-lime">Build its record.</span>
          </>
        }
        description="Publish tournaments, reach relevant athletes, manage participation and preserve verified results."
        highlights={["Publish", "Manage", "Verify"]}
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/tournaments/create">Create a tournament</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="network-hero-secondary-action"
            >
              <Link to="/contact">Talk to KheloLocal</Link>
            </Button>
          </>
        }
      />
      <Page className="py-14 sm:py-24">
        <SectionHeading eyebrow="One workflow" title="From announcement to sporting record." />
        <div className="grid gap-5 md:grid-cols-4">
          {WORKFLOW.map(({ icon: Icon, title, body }) => (
            <article key={title} className="data-card rounded-xl border-t-2 border-lime p-6">
              <Icon className="size-6 text-lime" />
              <h2 className="mt-8 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </Page>
    </div>
  );
}
