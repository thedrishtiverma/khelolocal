import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useCurrentAthlete, useKhelo } from "@/lib/services/store";
import { tournamentsOfAthlete } from "@/lib/services/selectors";

export const Route = createFileRoute("/athlete/tournaments")({
  head: () => ({
    meta: [
      { title: "My tournaments | KheloLocal" },
      {
        name: "description",
        content: "Every tournament you have registered for, plus your registration status.",
      },
      { property: "og:title", content: "My tournaments | KheloLocal" },
      { property: "og:description", content: "Track registrations, fixtures and results." },
    ],
  }),
  component: MyTournaments,
});

function MyTournaments() {
  const { db } = useKhelo();
  const athlete = useCurrentAthlete();

  if (!athlete) {
    return (
      <Page>
        <EmptyState
          title="Log in as an athlete"
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const all = tournamentsOfAthlete(db, athlete.id);
  const active = all.filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const past = all.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");
  const statusOf = (tournamentId: string) =>
    db.registrations.find((r) => r.tournamentId === tournamentId && r.athleteId === athlete.id)
      ?.status;

  return (
    <Page>
      <SectionHeading
        eyebrow="My sports"
        title="Tournaments you're part of"
        action={
          <Button asChild variant="outline">
            <Link to="/tournaments">Find more</Link>
          </Button>
        }
      />

      {all.length === 0 ? (
        <EmptyState
          title="You haven't registered yet."
          description="Explore open tournaments in Indore and register in a couple of taps."
          action={
            <Button asChild>
              <Link to="/tournaments">Explore tournaments</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-12">
          <div>
            <h3 className="mb-4 font-display text-lg font-bold">Active</h3>
            {active.length === 0 ? (
              <EmptyState title="Nothing active right now." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {active.map((t) => (
                  <TournamentCard key={t.id} tournament={t} footnote={`Registration: ${statusOf(t.id)}`} />
                ))}
              </div>
            )}
          </div>
          {past.length > 0 ? (
            <div>
              <h3 className="mb-4 font-display text-lg font-bold">Past</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Page>
  );
}