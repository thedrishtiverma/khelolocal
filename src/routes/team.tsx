import { createFileRoute } from "@tanstack/react-router";
import { Mail, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Founders team | KheloLocal" },
      { name: "description", content: "Meet the student-led team building KheloLocal for grassroots sports in India." },
    ],
  }),
  component: TeamPage,
});

const FOUNDERS = [
  ["Drishti Verma", "Team lead · Product and sports network"],
  ["Arpita Jamra", "Research · Athlete experience"],
  ["Prince Dhakad", "Product · Community workflows"],
  ["Gaurav Madavi", "Technology · Platform development"],
  ["Darshna Jain", "Research · Institutional partnerships"],
  ["Roshni Chouhan", "Sports data · Athlete records"],
];

function TeamPage() {
  return (
    <Page className="py-14 sm:py-24">
      <SectionHeading
        eyebrow="The people behind KheloLocal"
        title="A student-led team for local sport."
        subtitle="We are building the infrastructure we wished existed around the games we already play."
      />
      <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {FOUNDERS.map(([name, role], index) => (
          <article key={name} className="bg-card p-7 sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary font-num text-sm font-bold text-primary-foreground">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h2 className="mt-8 font-display text-2xl font-bold uppercase">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{role}</p>
          </article>
        ))}
      </div>
      <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <Users className="size-5 text-lime" /> Built from Indore, for the next generation of grassroots athletes.
        <a className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-lime" href="mailto:hello@khelolocal.in">
          <Mail className="size-4" /> Say hello
        </a>
      </div>
    </Page>
  );
}
