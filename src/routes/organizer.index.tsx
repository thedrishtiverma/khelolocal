import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { StatusBadge } from "@/components/shared/Badges";
import { formatDateRange } from "@/lib/format";
import { useCurrentOrganizer, useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/organizer/")({
  head: () => ({
    meta: [
      { title: "Organizer dashboard | KheloLocal" },
      {
        name: "description",
        content:
          "Run your tournaments: registrations, fixtures, scoring and verified result publishing.",
      },
      { property: "og:title", content: "Organizer dashboard | KheloLocal" },
      { property: "og:description", content: "Manage tournaments and verify results." },
    ],
  }),
  component: OrganizerDashboard,
});

function OrganizerDashboard() {
  const { db } = useKhelo();
  const organizer = useCurrentOrganizer();

  if (!organizer) {
    return (
      <Page>
        <EmptyState
          title="Log in as an organizer"
          description="Use the organizer demo account to run the Indore City Football Cup."
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
  const pendingRegs = db.registrations.filter(
    (r) => r.status === "PENDING" && mine.some((t) => t.id === r.tournamentId),
  );
  const pendingResults = db.matches.filter(
    (m) =>
      m.status === "COMPLETED" &&
      m.resultStatus === "PENDING" &&
      mine.some((t) => t.id === m.tournamentId),
  );

  return (
    <Page>
      <SectionHeading
        eyebrow={organizer.organizationName}
        title="Organizer dashboard"
        action={
          <Button asChild>
            <Link to="/organizer/create">
              <Plus className="size-4" />
              Create tournament
            </Link>
          </Button>
        }
      />

      <div className="surface-panel grid grid-cols-2 gap-6 rounded-xl p-6 sm:grid-cols-4">
        <Stat tone="invert" value={mine.length} label="Tournaments" />
        <Stat tone="invert" value={pendingRegs.length} label="Pending registrations" />
        <Stat tone="accent" value={pendingResults.length} label="Results to verify" />
        <Stat tone="invert" value={organizer.tournamentsHosted} label="Hosted all-time" />
      </div>

      {pendingResults.length > 0 ? (
        <div className="mt-6 rounded-xl border border-lime/40 bg-lime/10 p-5">
          <p className="font-display font-bold">
            {pendingResults.length} completed match
            {pendingResults.length > 1 ? "es" : ""} waiting for verification
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Verifying publishes stats and achievements to every athlete's profile.
          </p>
          <Button asChild className="mt-4">
            <Link to="/organizer/results">Review results</Link>
          </Button>
        </div>
      ) : null}

      <div className="mt-12">
        <SectionHeading title="Your tournaments" />
        {mine.length === 0 ? (
          <EmptyState
            title="No tournaments yet."
            action={
              <Button asChild>
                <Link to="/organizer/create">Create your first tournament</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {mine.map((t) => {
              const regs = db.registrations.filter((r) => r.tournamentId === t.id);
              return (
                <li key={t.id} className="flex flex-wrap items-center gap-4 p-5">
                  <div className="min-w-56 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-bold">{t.name}</h3>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.sportName} · {formatDateRange(t.startDate, t.endDate)} · {t.venue}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <Stat value={regs.length} label="Registrations" className="min-w-20" />
                    <Button asChild variant="secondary">
                      <Link to="/organizer/manage/$id" params={{ id: t.id }}>
                        Manage
                      </Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Page>
  );
}