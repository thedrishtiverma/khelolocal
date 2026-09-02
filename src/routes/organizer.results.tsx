import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { ResultBadge } from "@/components/shared/Badges";
import { VerifyDialog } from "@/components/organizer/VerifyDialog";
import { formatDate } from "@/lib/format";
import { useCurrentOrganizer, useKhelo } from "@/lib/services/store";
import { matchLabel } from "@/lib/services/selectors";
import type { Match } from "@/types";

export const Route = createFileRoute("/organizer/results")({
  head: () => ({
    meta: [
      { title: "Results & verification | KheloLocal" },
      {
        name: "description",
        content:
          "Verify completed match results so athlete stats and achievements become credible and discoverable.",
      },
      { property: "og:title", content: "Results & verification | KheloLocal" },
      { property: "og:description", content: "The verification step that powers athlete data." },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { db } = useKhelo();
  const organizer = useCurrentOrganizer();
  const [verifying, setVerifying] = useState<Match | null>(null);

  if (!organizer) {
    return (
      <Page>
        <EmptyState
          title="Log in as an organizer"
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const mine = db.tournaments.filter((t) => t.organizerId === organizer.id);
  const matches = db.matches
    .filter((m) => m.status === "COMPLETED" && mine.some((t) => t.id === m.tournamentId))
    .sort((a, b) => (a.resultStatus === "PENDING" ? -1 : 1));

  return (
    <Page>
      <SectionHeading
        eyebrow="Verification"
        title="Results"
        subtitle="Verified results are the source of truth for every athlete profile on KheloLocal."
      />
      {matches.length === 0 ? (
        <EmptyState title="No completed matches yet." />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {matches.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-56 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {mine.find((t) => t.id === m.tournamentId)?.name} · {m.round}
                </p>
                <p className="mt-1 font-semibold">{matchLabel(db, m)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(m.scheduledAt)}</p>
              </div>
              <span className="stat-num text-xl">
                {m.teamAScore} – {m.teamBScore}
              </span>
              <ResultBadge status={m.resultStatus} />
              {m.resultStatus === "PENDING" ? (
                <Button size="sm" onClick={() => setVerifying(m)}>
                  <BadgeCheck className="size-4" />
                  Verify
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {verifying ? (
        <VerifyDialog
          key={verifying.id}
          match={verifying}
          open
          onOpenChange={(v) => !v && setVerifying(null)}
        />
      ) : null}
    </Page>
  );
}
