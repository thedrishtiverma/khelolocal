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
        description="We are building the infrastructure that helps local games become visible, trusted and full of opportunity from the ground up."
        highlights={["Our story", "Product", "Community"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="mb-10 rounded-2xl border border-border bg-secondary/35 p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Our story
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
            We started with one city and a simple idea:{" "}
            <span className="text-lime">local sport deserves a real record.</span>
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            KheloLocal was built by people who saw the gap between games that happened every day and
            the systems that could actually recognize them. We wanted a platform that helps
            athletes, organizers, teams and institutions turn local participation into visible
            opportunity, trust and momentum.
          </p>
        </div>
        <SectionHeading
          eyebrow="Founders team"
          title={
            <>
              Meet the people <span className="text-lime">building the network.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((founder, index) => (
            <Link
              key={founder.slug}
              to="/team/$member"
              params={{ member: founder.slug }}
              className="group rounded-xl border border-border bg-card p-7 transition-colors hover:bg-secondary/60 sm:p-8"
            >
              <div className="team-card-media relative flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-primary font-num text-sm font-bold text-primary-foreground">
                {founder.image ? (
                  <img
                    src={founder.image}
                    alt={`${founder.name} profile`}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </div>
              <h2 className="mt-8 font-display text-2xl font-bold uppercase group-hover:text-lime">
                {founder.name}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-lime">{founder.role}</p>
              <span className="mt-6 inline-block text-sm font-bold">View profile →</span>
            </Link>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
          <Users className="size-5 text-lime" /> Built by a student-led team for the next generation
          of grassroots athletes.
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
