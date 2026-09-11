import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, BadgeCheck, Search, Trophy, Users } from "lucide-react";
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
      <Page className="max-w-4xl py-14 sm:py-20">
        <ol className="space-y-4">
          {STEPS.map(([number, title, body, Icon], index) => (
            <li
              key={title}
              className="relative flex gap-5 border-l-2 border-lime pb-8 pl-6 last:pb-0"
            >
              <span className="absolute -left-[17px] flex size-8 items-center justify-center rounded-full bg-lime font-num text-xs font-bold text-lime-foreground">
                {number}
              </span>
              <div>
                <Icon className="size-5 text-lime" />
                <h2 className="mt-3 font-display text-2xl font-bold uppercase">{title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
              {index < STEPS.length - 1 ? (
                <ArrowDown className="absolute -bottom-1 -left-[11px] size-4 text-lime" />
              ) : null}
            </li>
          ))}
        </ol>
      </Page>
    </div>
  );
}
