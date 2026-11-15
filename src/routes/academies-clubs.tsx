import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Dumbbell, Handshake, Search, ShieldCheck, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import {
  OrganizationFeatureGrid,
  OrganizationLinks,
  OrganizationPage,
} from "@/components/organization/OrganizationPageSections";

export const Route = createFileRoute("/academies-clubs")({
  head: () => ({
    meta: [
      { title: "For sports academies & clubs | KheloLocal" },
      {
        name: "description",
        content:
          "Discover local athletes, build teams and connect your sports academy or club to KheloLocal.",
      },
      { property: "og:title", content: "For sports academies & clubs | KheloLocal" },
      {
        property: "og:description",
        content: "Find talent. Build teams. Grow your sports community.",
      },
    ],
  }),
  component: AcademiesClubsPage,
});

const ACADEMY_FEATURES = [
  {
    icon: Dumbbell,
    title: "Showcase your academy",
    description:
      "Academy and club profile listings are not self-serve yet. Tell us about your programme to discuss a listing.",
    available: false,
    href: "mailto:khelolocal@gmail.com?subject=Academy%20or%20club%20profile",
    action: "Enquire about a profile",
  },
  {
    icon: Search,
    title: "Discover local athletes",
    description: "Search athlete profiles by sport, position, institution and verified experience.",
    available: true,
    to: "/athletes",
    action: "Explore athletes",
  },
  {
    icon: Handshake,
    title: "Connect with players",
    description:
      "Join the existing coach and scout network to save profiles and request athlete connections.",
    available: true,
    to: "/coaches",
    action: "Explore coach tools",
  },
  {
    icon: Trophy,
    title: "Promote trials and programmes",
    description:
      "Trial, training programme and opportunity listings are not available yet. Contact us to discuss your plans.",
    available: false,
    href: "mailto:khelolocal@gmail.com?subject=Academy%20trials%20and%20programmes",
    action: "Talk to our team",
  },
  {
    icon: Users,
    title: "Explore local teams",
    description: "See teams already building rosters and playing across the local sports network.",
    available: true,
    to: "/teams",
    action: "Browse teams",
  },
  {
    icon: ShieldCheck,
    title: "Start with a coach or team account",
    description:
      "The current signup supports coaches, scouts and teams, with access to athlete discovery tools.",
    available: true,
    href: "/signup?role=SCOUT",
    action: "Join KheloLocal",
  },
] as const;

function AcademiesClubsPage() {
  return (
    <div>
      <NetworkHero
        tone="athletes"
        eyebrow="For academies and clubs"
        title={
          <>
            Find Talent. Build Teams. <span className="text-lime">Grow Your Sports Community.</span>
          </>
        }
        description="Discover local players, connect with athletes and grow your place in the grassroots sports network."
        highlights={["Discover", "Connect", "Grow"]}
        actions={
          <>
            <Button asChild size="lg">
              <a href="mailto:khelolocal@gmail.com?subject=Register%20my%20academy%20or%20club">
                Register Your Academy <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="network-hero-secondary-action">
              <Link to="/signup?role=SCOUT">Join as coach or team</Link>
            </Button>
          </>
        }
      />
      <OrganizationPage>
        <SectionHeading
          eyebrow="A place to grow the game"
          title={
            <>
              Build a stronger <span className="text-lime">sports community.</span>
            </>
          }
          subtitle="Use athlete and team discovery today. Academy profiles and opportunity listings are enquiry-led while those tools are being developed."
        />
        <OrganizationFeatureGrid features={ACADEMY_FEATURES} />
        <div className="organization-dashboard-cta mt-8 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">
              Already coaching or scouting?
            </p>
            <h2 className="mt-2 font-display text-2xl font-black uppercase">
              Find a player for your next lineup.
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/athletes">
              Find local athletes <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <OrganizationLinks current="/academies-clubs" />
      </OrganizationPage>
    </div>
  );
}
