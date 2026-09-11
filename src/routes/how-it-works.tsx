import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Search, Trophy, Users } from "lucide-react";
import { Page } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How KheloLocal works" },
      {
        name: "description",
        content: "Play locally, record the result, verify the achievement and get discovered.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  ["01", "Play", "Find sports and opportunities around you.", Search],
  ["02", "Compete", "Join tournaments and represent your institution, team or club.", Trophy],
  ["03", "Result", "Your performance becomes part of your sporting history.", Users],
  ["04", "Verify", "Organizers and institutions can verify your achievements.", BadgeCheck],
  [
    "05",
    "Get discovered",
    "Build a sporting profile teams, coaches and organizers can find.",
    Search,
  ],
] as const;

function HowItWorksPage() {
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="How KheloLocal works"
        title={
          <>
            Play locally. Build something that <span className="text-lime">lasts.</span>
          </>
        }
        description="A simple loop connecting participation to opportunity."
        highlights={["Play", "Verify", "Discover"]}
      />
      <Page className="max-w-6xl py-14 sm:py-20">
        <ol className="process-flow grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(([number, title, body, Icon], index) => (
            <li
              key={title}
              className="process-flow-step relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="process-flow-number flex size-10 items-center justify-center rounded-full bg-lime font-num text-xs font-bold text-lime-foreground">
                {number}
              </span>
              <Icon className="mt-7 size-6 text-lime" />
              <h2 className="mt-5 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              {index < STEPS.length - 1 ? (
                <ArrowRight className="process-flow-arrow absolute -right-4 top-1/2 z-10 hidden size-7 -translate-y-1/2 rounded-full border border-lime bg-background p-1 text-lime lg:block" />
              ) : null}
            </li>
          ))}
        </ol>
      </Page>
    </div>
  );
}
