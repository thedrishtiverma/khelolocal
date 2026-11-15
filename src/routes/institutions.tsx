import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  ClipboardCheck,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { InstitutionBanner } from "@/components/shared/InstitutionBanner";
import { SimpleBanner } from "@/components/shared/SimpleBanner";
import { RoleIcon } from "@/components/shared/KheloIcon";
import { useKhelo } from "@/lib/services/store";
import {
  OrganizationFeatureGrid,
  OrganizationLinks,
  OrganizationPage,
} from "@/components/organization/OrganizationPageSections";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutions | KheloLocal" },
      {
        name: "description",
        content: "Give every student athlete a sporting record that stays with them.",
      },
    ],
  }),
  component: InstitutionsPage,
});

const AREAS = [
  [
    Building2,
    "Institution profile",
    "Show the sports culture, teams and events your institution is building.",
  ],
  [
    Users,
    "Athlete records",
    "Keep student sporting identities connected to the place where they compete.",
  ],
  [
    Trophy,
    "Tournament history",
    "Create a searchable record of fixtures, participation and results.",
  ],
  [ShieldCheck, "Result verification", "Confirm achievements with clear, trusted verification."],
  [ClipboardCheck, "Sports events", "Run campus competitions with a home for every detail."],
  [Search, "Athlete discovery", "Find the players and teams shaping local sport."],
] as const;

const INSTITUTION_FEATURES = [
  {
    icon: Building2,
    title: "Institutional athlete records",
    description:
      "Keep athlete profiles connected to the college or institution where they compete.",
    available: true,
    to: "/college",
    action: "Open institution dashboard",
  },
  {
    icon: ShieldCheck,
    title: "Verified achievements",
    description:
      "Review student participation and achievements, with verification status visible in records.",
    available: true,
    to: "/college/records",
    action: "Review records",
  },
  {
    icon: Search,
    title: "Discover athletes",
    description:
      "Search the local network by sport, institution, position and verified experience.",
    available: true,
    to: "/athletes",
    action: "Find athletes",
  },
  {
    icon: Users,
    title: "Teams and campus events",
    description:
      "Institution team administration and campus event publishing are not self-serve yet.",
    available: false,
    href: "mailto:khelolocal@gmail.com?subject=Institution%20teams%20and%20events",
    action: "Ask about institution tools",
  },
  {
    icon: Activity,
    title: "Participation overview",
    description:
      "See student athletes, records on file and verification progress in the institution workspace.",
    available: true,
    to: "/college",
    action: "View dashboard",
  },
  {
    icon: ClipboardCheck,
    title: "Register your institution",
    description:
      "Use the existing institution signup to create an account and start your sports desk.",
    available: true,
    to: "/signup",
    action: "Start institution signup",
  },
] as const;

function InstitutionsPage() {
  const { db } = useKhelo();
  return (
    <div>
      <NetworkHero
        tone="institutions"
        eyebrow="For institutions"
        title={
          <>
            Build a Stronger <span className="text-lime">Sporting Community.</span>
          </>
        }
        description="Give school, college and university athletes a trusted home for their sporting profiles, participation and achievements."
        highlights={["Athlete profiles", "Verified records", "Performance"]}
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/signup?role=COLLEGE">Register Your Institution</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="network-hero-secondary-action">
              <Link to="/college">Institution dashboard</Link>
            </Button>
          </>
        }
      />
      <OrganizationPage>
        <SimpleBanner
          label="Sports institutions"
          icon={<RoleIcon role="institution" className="size-4" />}
          tone="institution"
          className="mb-6"
        />
        <SectionHeading
          eyebrow="Your institution toolkit"
          title={
            <>
              Help every athlete <span className="text-lime">leave a record.</span>
            </>
          }
          subtitle="Manage verified records and discover athletes with existing tools. Contact us about institutional features still in development."
        />
        <OrganizationFeatureGrid features={INSTITUTION_FEATURES} />

        <OrganizationLinks current="/institutions" />

        <section className="mt-16">
          <SectionHeading
            eyebrow="Built on verified participation"
            title={
              <>
                Tools for your <span className="text-lime">sports cell.</span>
              </>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map(([Icon, title, body]) => (
              <article key={title} className="data-card rounded-xl p-6">
                <Icon className="size-6 text-lime" />
                <h2 className="mt-6 font-display text-xl font-bold uppercase">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>
        {db.colleges.length ? (
          <section className="mt-16 grid gap-5 sm:grid-cols-2">
            {db.colleges.map((college) => (
              <InstitutionBanner key={college.id} college={college} />
            ))}
          </section>
        ) : null}
      </OrganizationPage>
    </div>
  );
}
