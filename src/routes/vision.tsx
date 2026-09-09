import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MapPin, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "Our vision | KheloLocal" },
      { name: "description", content: "KheloLocal is building a trusted city-by-city network for grassroots sport." },
    ],
  }),
  component: VisionPage,
});

function VisionPage() {
  return (
    <div>
      <section className="surface-panel">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">Our vision</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] sm:text-8xl">
            Make every local game count.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-surface-foreground/70 sm:text-xl">
            KheloLocal connects the games already happening in our cities to the people, records, and opportunities that help athletes keep moving forward.
          </p>
        </div>
      </section>
      <Page className="py-14 sm:py-24">
        <SectionHeading eyebrow="The long view" title="From one city to a connected sports network." />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Start local", body: "Build enough trust and density in Indore for the network to become genuinely useful." },
            { icon: BadgeCheck, title: "Build trust", body: "Turn results, records, and achievements into evidence-backed sporting identities." },
            { icon: Trophy, title: "Open opportunity", body: "Help athletes, teams, coaches, and organizers find the next right connection." },
          ].map(({ icon: Icon, title, body }) => (
            <article key={title} className="border-t-2 border-lime bg-secondary/40 p-7 sm:p-8">
              <Icon className="size-6 text-lime" />
              <h2 className="mt-8 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-8">
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">The goal is simple: make local sport more discoverable, connected, structured, and trustworthy.</p>
          <Button asChild><Link to="/tournaments">Explore Indore <ArrowRight className="size-4" /></Link></Button>
        </div>
      </Page>
    </div>
  );
}
