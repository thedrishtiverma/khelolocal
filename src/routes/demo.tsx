import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo walkthrough | KheloLocal" },
      {
        name: "description",
        content:
          "Run the KheloLocal demo: register for a tournament, verify a result, then discover the athlete as a scout.",
      },
      { property: "og:title", content: "Demo walkthrough | KheloLocal" },
      {
        property: "og:description",
        content: "See the tournament-to-athlete-data loop in 3 minutes.",
      },
    ],
  }),
  component: DemoPage,
});

const STEPS = [
  {
    title: "1. Athlete registers",
    body: "Log in as the athlete and register for the Indore City Football Cup.",
    to: "/tournaments" as const,
    cta: "Open tournaments",
  },
  {
    title: "2. Organizer runs the match",
    body: "Log in as the organizer, approve registrations, generate fixtures and enter the score.",
    to: "/organizer" as const,
    cta: "Open organizer dashboard",
  },
  {
    title: "3. Organizer verifies the result",
    body: "Verification writes verified stats and achievements onto athlete profiles instantly.",
    to: "/organizer/results" as const,
    cta: "Open results",
  },
  {
    title: "4. Scout discovers the athlete",
    body: "Log in as a scout, filter by sport and position, then open a verified profile.",
    to: "/discover" as const,
    cta: "Open discovery",
  },
];

function DemoPage() {
  const { resetDemo } = useKhelo();

  return (
    <Page className="max-w-3xl">
      <SectionHeading
        eyebrow="Demo tools"
        title="The tournament-to-athlete-data loop"
        subtitle="Four steps, three roles, one verified record."
      />
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.title} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-lg font-bold">{s.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            <Button asChild variant="secondary" size="sm" className="mt-4">
              <Link to={s.to}>{s.cta}</Link>
            </Button>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <p className="font-display font-bold">Reset demo data</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Restores the original Indore dataset, clearing any results you verified.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            resetDemo();
            toast.success("Demo data reset");
          }}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>
    </Page>
  );
}
