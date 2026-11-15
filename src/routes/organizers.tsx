import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, BadgeCheck, CalendarPlus, Megaphone, Search, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Button } from "@/components/ui/button";
import { OrganizerBanner } from "@/components/shared/OrganizerBanner";
import { useKhelo } from "@/lib/services/store";
import {
  OrganizationFeatureGrid,
  OrganizationLinks,
  OrganizationPage,
} from "@/components/organization/OrganizationPageSections";

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

const ORGANIZER_FEATURES = [
  {
    icon: Search,
    title: "Reach local athletes",
    description: "Help nearby players find your competition through the tournament network.",
    available: true,
    to: "/athletes",
    action: "Discover athletes",
  },
  {
    icon: CalendarPlus,
    title: "Create and publish",
    description: "Publish an event with its sport, dates, venue, eligibility and entry details.",
    available: true,
    to: "/tournaments/create",
    action: "List your tournament",
  },
  {
    icon: Users,
    title: "Manage registrations",
    description: "Review participation and keep tournament operations in one organizer workspace.",
    available: true,
    to: "/organizer",
    action: "Open organizer dashboard",
  },
  {
    icon: Megaphone,
    title: "Featured listings",
    description:
      "Featured placement is not self-serve yet. Ask the team about ways to spotlight an event.",
    available: false,
    href: "mailto:khelolocal@gmail.com?subject=Tournament%20featured%20listing",
    action: "Ask about promotion",
  },
  {
    icon: Activity,
    title: "Track activity and results",
    description: "Review tournament activity and submit completed results for verification.",
    available: true,
    to: "/organizer/results",
    action: "Manage results",
  },
  {
    icon: BadgeCheck,
    title: "Show up in the local fixture list",
    description: "Help athletes and supporters discover competitions happening across the city.",
    available: true,
    to: "/tournaments",
    action: "Browse tournaments",
  },
] as const;

function OrganizersPage() {
  const { db } = useKhelo();
  return (
    <div>
      <NetworkHero
        tone="organizers"
        eyebrow="For organizers"
        title={
          <>
            Run Better Tournaments. <span className="text-lime">Reach More Athletes.</span>
          </>
        }
        description="One local workflow to publish fixtures, connect with athletes, manage entries and build a verified record of every result."
        highlights={["Create", "Connect", "Verify"]}
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/tournaments/create">List Your Tournament</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="network-hero-secondary-action">
              <Link to="/explore">Explore KheloLocal</Link>
            </Button>
          </>
        }
      />
      <OrganizationPage>
        <SectionHeading
          eyebrow="The organizer toolkit"
          title={
            <>
              Every matchday detail. <span className="text-lime">One place.</span>
            </>
          }
          subtitle="Use the tools already live in KheloLocal, and ask us about promotional options still taking shape."
        />
        <OrganizationFeatureGrid features={[...ORGANIZER_FEATURES]} />

        <div className="organization-dashboard-cta mt-8 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">
              Already on KheloLocal?
            </p>
            <h2 className="mt-2 font-display text-2xl font-black uppercase">
              Pick up where your tournament left off.
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/organizer">Open organizer dashboard</Link>
          </Button>
        </div>

        <OrganizationLinks current="/organizers" />

        <section className="mt-16">
          <SectionHeading
            eyebrow="Already part of the network"
            title={
              <>
                Local organizers <span className="text-lime">in Indore.</span>
              </>
            }
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {db.organizers.map((organizer) => (
              <OrganizerBanner key={organizer.id} organizer={organizer} showContacts={false} />
            ))}
          </div>
        </section>
      </OrganizationPage>
    </div>
  );
}
