import { ArrowRight, Check, Clock3 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Page, SectionHeading } from "@/components/shared/Bits";

export type OrganizationPath =
  | "/academies-clubs"
  | "/athletes"
  | "/college"
  | "/college/records"
  | "/coaches"
  | "/explore"
  | "/institutions"
  | "/organizer"
  | "/organizers"
  | "/organizer/results"
  | "/partners"
  | "/signup"
  | "/teams"
  | "/tournaments"
  | "/tournaments/create";

export type OrganizationFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  available: boolean;
  to?: OrganizationPath;
  href?: string;
  action?: string;
};

const ORGANIZATION_PAGES = [
  {
    to: "/organizers",
    label: "Tournament organizers",
    description: "Publish fixtures, manage entries and verify results.",
  },
  {
    to: "/institutions",
    label: "Schools & institutions",
    description: "Build a trusted record of campus sport.",
  },
  {
    to: "/academies-clubs",
    label: "Academies & clubs",
    description: "Find athletes and grow your local team.",
  },
  {
    to: "/partners",
    label: "Sponsors & partners",
    description: "Back the people and events moving grassroots sport.",
  },
] as const;

export function OrganizationFeatureGrid({
  features,
}: {
  features: readonly OrganizationFeature[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ icon: Icon, title, description, available, to, href, action }) => (
        <article key={title} className="organization-feature-card">
          <div className="flex items-start justify-between gap-4">
            <span className="organization-feature-icon">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span
              className={`organization-feature-status ${available ? "organization-feature-status-live" : ""}`}
            >
              {available ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Clock3 className="size-3.5" aria-hidden="true" />
              )}
              {available ? "Available now" : "Enquiry"}
            </span>
          </div>
          <h3 className="mt-7 font-display text-xl font-black uppercase">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
          {to && action ? (
            <Link to={to} className="organization-feature-link">
              {action} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : href && action ? (
            <a href={href} className="organization-feature-link">
              {action} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function OrganizationLinks({ current }: { current: OrganizationPath }) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <SectionHeading
        eyebrow="One local network"
        title={
          <>
            Find your <span className="text-lime">place in the game.</span>
          </>
        }
        subtitle="Explore the tools built for the other people who make local sport happen."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ORGANIZATION_PAGES.filter((page) => page.to !== current).map((page) => (
          <Link
            key={page.to}
            to={page.to}
            className="organization-related-link group rounded-xl p-5"
          >
            <h3 className="font-display text-lg font-bold uppercase transition-colors group-hover:text-lime">
              {page.label}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.description}</p>
            <ArrowRight
              className="mt-5 size-4 text-lime transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function OrganizationPage({ children }: { children: ReactNode }) {
  return <Page className="py-12 sm:py-16">{children}</Page>;
}
