import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { FOUNDERS } from "@/lib/founders";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Founders team | KheloLocal" },
      {
        name: "description",
        content: "Meet the student-led team building KheloLocal for grassroots sports in India.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="The people behind KheloLocal"
        title={
          <>
            A student-led team for <span className="text-lime">local sport.</span>
          </>
        }
        description="We are building the infrastructure we wished existed around the games we already play."
        highlights={["Product", "Community", "Trust"]}
      />
      <Page className="py-14 sm:py-20">
        <SectionHeading eyebrow="Founders team" title="Meet the people building the network." />
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((founder, index) => (
            <Link
              key={founder.slug}
              to="/team/$member"
              params={{ member: founder.slug }}
              className="group bg-card p-7 transition-colors hover:bg-secondary/60 sm:p-8"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary font-num text-sm font-bold text-primary-foreground">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-8 font-display text-2xl font-bold uppercase group-hover:text-lime">
                {founder.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{founder.role}</p>
              <span className="mt-6 inline-block text-sm font-bold">View profile →</span>
            </Link>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
          <Users className="size-5 text-lime" /> Built from Indore, for the next generation of
          grassroots athletes.
          <a
            className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-lime"
            href="mailto:khelolocal@gmail.com"
          >
            <Mail className="size-4" /> Say hello
          </a>
        </div>
      </Page>
    </div>
  );
}
