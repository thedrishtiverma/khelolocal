import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, HeartHandshake, Megaphone, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import {
  OrganizationFeatureGrid,
  OrganizationLinks,
  OrganizationPage,
} from "@/components/organization/OrganizationPageSections";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Sponsors & partners | KheloLocal" },
      {
        name: "description",
        content:
          "Partner with KheloLocal to support local tournaments, emerging athletes and grassroots sports communities.",
      },
      { property: "og:title", content: "Sponsors & partners | KheloLocal" },
      {
        property: "og:description",
        content: "Be part of the grassroots sports movement.",
      },
    ],
  }),
  component: PartnersPage,
});

const PARTNER_FEATURES = [
  {
    icon: Trophy,
    title: "Sponsor local tournaments",
    description:
      "Tell us which sport, community or event you would like to support. We will discuss suitable opportunities.",
    available: false,
    href: "#partnership-enquiry",
    action: "Start an enquiry",
  },
  {
    icon: Users,
    title: "Support emerging athletes",
    description:
      "Share your goals with the team to explore responsible ways to back local sporting talent.",
    available: false,
    href: "#partnership-enquiry",
    action: "Discuss athlete support",
  },
  {
    icon: HeartHandshake,
    title: "Partner with sports communities",
    description:
      "Work with local organizers, institutions and teams to make grassroots sport easier to access.",
    available: false,
    href: "#partnership-enquiry",
    action: "Explore a partnership",
  },
  {
    icon: Megaphone,
    title: "Promote your brand locally",
    description:
      "Event and brand placements are arranged through direct enquiries; self-serve sponsorship tools are not live yet.",
    available: false,
    href: "#partnership-enquiry",
    action: "Ask about visibility",
  },
  {
    icon: Building2,
    title: "Meet the local network",
    description: "Explore the organizers and institutions already connecting people through sport.",
    available: true,
    to: "/explore",
    action: "Explore KheloLocal",
  },
] as const;

function PartnersPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="Sponsors and partners"
        title={
          <>
            Be Part of the <span className="text-lime">Grassroots Sports Movement.</span>
          </>
        }
        description="Bring your brand, business or organisation closer to the local tournaments, athletes and communities shaping sport."
        highlights={["Local impact", "Shared passion", "Stronger communities"]}
        actions={
          <Button asChild size="lg">
            <a href="#partnership-enquiry">
              Become a Partner <ArrowRight className="size-4" />
            </a>
          </Button>
        }
      />
      <OrganizationPage>
        <SectionHeading
          eyebrow="Make a local impact"
          title={
            <>
              Put your support <span className="text-lime">where the game is.</span>
            </>
          }
          subtitle="KheloLocal is building its partner programme. Share what you have in mind and the team will follow up directly."
        />
        <OrganizationFeatureGrid features={PARTNER_FEATURES} />

        <section
          id="partnership-enquiry"
          className="organization-enquiry mt-14 grid scroll-mt-24 gap-8 rounded-2xl p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime">
              Let’s start a conversation
            </p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase sm:text-4xl">
              Bring your partnership idea to the field.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              This enquiry is prepared as an email to KheloLocal. Your mail app will open with the
              details you provide; nothing is stored or submitted to a backend.
            </p>
            <p className="mt-5 text-sm font-semibold">Looking for a specific community?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="text-sm font-bold text-lime hover:underline" to="/organizers">
                Organizers
              </Link>
              <Link className="text-sm font-bold text-lime hover:underline" to="/institutions">
                Institutions
              </Link>
              <Link className="text-sm font-bold text-lime hover:underline" to="/academies-clubs">
                Academies & clubs
              </Link>
            </div>
          </div>
          {submitted ? (
            <div className="flex flex-col justify-center rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-2xl font-black uppercase">Email draft opened</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Complete and send the draft from your email app to reach KheloLocal.
              </p>
              <Button className="mt-6 w-fit" variant="outline" onClick={() => setSubmitted(false)}>
                Edit enquiry
              </Button>
            </div>
          ) : (
            <form
              className="grid gap-5 rounded-xl border border-border bg-card p-5 sm:p-7"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const name = String(formData.get("name")).trim();
                const organization = String(formData.get("organization")).trim();
                const email = String(formData.get("email")).trim();
                const interest = String(formData.get("interest"));
                const message = String(formData.get("message")).trim();
                const subject = `KheloLocal partnership enquiry — ${organization}`;
                const body = [
                  `Name: ${name}`,
                  `Organization: ${organization}`,
                  `Email: ${email}`,
                  `Partnership interest: ${interest}`,
                  "",
                  message,
                ].join("\n");

                window.location.href = `mailto:khelolocal@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                setSubmitted(true);
                toast.info("Your email app should open with the enquiry draft.");
              }}
            >
              <h3 className="font-display text-2xl font-black uppercase">Partnership enquiry</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold">
                  Your name
                  <Input name="name" required autoComplete="name" placeholder="Full name" />
                </label>
                <label className="space-y-2 text-sm font-semibold">
                  Work email
                  <Input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@organization.com"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm font-semibold">
                Business or organization
                <Input
                  name="organization"
                  required
                  autoComplete="organization"
                  placeholder="Organization name"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                I’m interested in
                <select
                  name="interest"
                  required
                  defaultValue=""
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Choose a partnership area
                  </option>
                  <option value="Tournament sponsorship">Tournament sponsorship</option>
                  <option value="Athlete support">Athlete support</option>
                  <option value="Community partnership">Community partnership</option>
                  <option value="Brand visibility">Brand visibility</option>
                  <option value="Other">Other idea</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                Tell us a little more
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="What community or sporting opportunity would you like to support?"
                />
              </label>
              <div>
                <Button type="submit">
                  Prepare email enquiry <ArrowRight className="size-4" />
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Opens your email app. You’ll review and send the message yourself.
                </p>
              </div>
            </form>
          )}
        </section>
        <OrganizationLinks current="/partners" />
      </OrganizationPage>
    </div>
  );
}
