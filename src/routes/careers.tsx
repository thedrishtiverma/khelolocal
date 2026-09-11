import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | KheloLocal" },
      { name: "description", content: "Join the team building a trusted local sports network." },
    ],
  }),
  component: CareersPage,
});

const ROLES = [
  [
    "Community volunteer",
    "Indore · Flexible",
    "Help map the tournaments, grounds and opportunities that deserve to be found.",
  ],
  [
    "Campus sports partner",
    "Indore · Part-time",
    "Bring verified student sport, events and records from your institution into the network.",
  ],
  [
    "Product intern",
    "Indore · Project-based",
    "Help test and improve tools for athletes, organizers and local sports communities.",
  ],
] as const;

function CareersPage() {
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="Careers at KheloLocal"
        title={
          <>
            Build for the <span className="text-lime">home ground.</span>
          </>
        }
        description="We are a student-led team creating the sporting infrastructure local cities deserve. Bring curiosity, care and a love for making sport easier to find."
        highlights={["Indore / 01", "Student-led", "Local impact"]}
        actions={
          <Button asChild size="lg">
            <a href="mailto:khelolocal@gmail.com?subject=KheloLocal%20careers">
              Introduce yourself <ArrowRight className="size-4" />
            </a>
          </Button>
        }
      />
      <Page className="py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              HeartHandshake,
              "Care about the details",
              "The best local networks are built with real empathy for the people using them.",
            ],
            [
              MapPin,
              "Start where you are",
              "We are building from Indore, learning directly from the places and people around us.",
            ],
            [
              Sparkles,
              "Make useful things",
              "Every contribution should make it easier for someone to play, organize or be discovered.",
            ],
          ].map(([Icon, title, body]) => {
            const CardIcon = Icon as typeof HeartHandshake;
            return (
              <article key={title as string} className="data-card rounded-2xl p-6">
                <CardIcon className="size-6 text-lime" />
                <h2 className="mt-7 font-display text-2xl font-black uppercase">
                  {title as string}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body as string}</p>
              </article>
            );
          })}
        </div>
        <section className="mt-16">
          <SectionHeading
            eyebrow="Open to conversations"
            title="Find your place in the network."
            subtitle="These are early opportunities. If you see a different way to help, write to us."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {ROLES.map(([title, location, body]) => (
              <article key={title} className="data-card-muted rounded-2xl border border-border p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">
                  {location}
                </p>
                <h2 className="mt-5 font-display text-2xl font-black uppercase">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
                <a
                  href={`mailto:khelolocal@gmail.com?subject=${encodeURIComponent(`KheloLocal — ${title}`)}`}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold hover:text-lime"
                >
                  Express interest <ArrowRight className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </section>
        <p className="mt-14 text-sm text-muted-foreground">
          Want to understand the team first?{" "}
          <Link to="/team" className="font-bold text-foreground hover:text-lime">
            Meet the founders.
          </Link>
        </p>
      </Page>
    </div>
  );
}
