import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, ShieldCheck, UserRound } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification | KheloLocal" },
      { name: "description", content: "Understand how a KheloLocal sporting record earns trust." },
    ],
  }),
  component: VerificationPage,
});

const LEVELS = [
  [UserRound, "Self-reported", "Added by the athlete."],
  [BadgeCheck, "Organizer verified", "Confirmed by the tournament organizer."],
  [Building2, "Institution verified", "Confirmed by the athlete’s institution."],
  [ShieldCheck, "Platform verified", "Reviewed by KheloLocal administration."],
] as const;

function VerificationPage() {
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="Verified record"
        title={
          <>
            Can I trust this <span className="text-lime">sporting record?</span>
          </>
        }
        description="KheloLocal makes it clear where a result came from and who confirmed it."
        highlights={["Source", "Review", "Trust"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map(([Icon, title, body], index) => (
            <article key={title} className="data-card rounded-xl p-6">
              <span className="font-num text-sm text-lime">0{index + 1}</span>
              <Icon className="mt-8 size-7 text-lime" />
              <h2 className="mt-6 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </Page>
    </div>
  );
}
