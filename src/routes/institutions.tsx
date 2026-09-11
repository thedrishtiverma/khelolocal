import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ClipboardCheck, Search, ShieldCheck, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";

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

function InstitutionsPage() {
  const { db } = useKhelo();
  return (
    <div>
      <NetworkHero
        tone="institutions"
        eyebrow="For institutions"
        title={
          <>
            Your athletes compete. Their <span className="text-lime">records stay.</span>
          </>
        }
        description="Bring athlete records, tournament history and verified results together in one sporting home."
        highlights={["Records", "Events", "Verification"]}
        actions={
          <Button asChild size="lg">
            <Link to="/signup">Register your institution</Link>
          </Button>
        }
      />
      <Page className="py-14 sm:py-20">
        <SectionHeading
          eyebrow="A lasting sporting record"
          title="Everything your sports cell needs."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(([Icon, title, body]) => (
            <article key={title} className="data-card rounded-xl p-6">
              <Icon className="size-6 text-lime" />
              <h2 className="mt-8 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        {db.colleges.length ? (
          <section className="mt-16 rounded-2xl border border-border bg-card p-7 sm:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Building sport in Indore
            </p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase">
              {db.colleges[0].shortName}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {db.colleges[0].description}
            </p>
          </section>
        ) : null}
      </Page>
    </div>
  );
}
