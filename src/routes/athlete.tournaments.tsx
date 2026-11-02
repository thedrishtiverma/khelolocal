import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useCurrentAthlete, useKhelo } from "@/lib/services/store";
import { effectiveTournamentStatus, tournamentsOfAthlete } from "@/lib/services/selectors";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { getAthleteTournamentRegistrations } from "@/lib/services/tournament-backend";
import type { Registration, Tournament } from "@/types";

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
  const { db, hydrated, currentUser } = useKhelo();
  const athlete = useCurrentAthlete();
  const participationId = isSupabaseConfigured()
    ? currentUser?.role === "ATHLETE"
      ? currentUser.id
      : null
    : athlete?.id;
  const [remoteRegistrations, setRemoteRegistrations] = useState<Registration[]>([]);
  const [remoteTournaments, setRemoteTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured() || !participationId) return;

    let active = true;
    setLoading(true);
    setLoadError("");
    void getAthleteTournamentRegistrations()
      .then(({ registrations, tournaments }) => {
        if (!active) return;
        setRemoteRegistrations(registrations);
        setRemoteTournaments(tournaments);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "Could not load your registrations.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [participationId]);

  if (!hydrated) {
    return (
      <Page>
        <p className="py-12 text-center text-sm text-muted-foreground" role="status">
          Loading your account…
        </p>
      </Page>
    );
  }

  if (!participationId) {
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

  const all = isSupabaseConfigured()
    ? remoteTournaments
    : athlete
      ? tournamentsOfAthlete(db, athlete.id)
      : [];
  const active = all.filter((t) => {
    const status = effectiveTournamentStatus(t);
    return status !== "COMPLETED" && status !== "CANCELLED";
  });
  const past = all.filter((t) => {
    const status = effectiveTournamentStatus(t);
    return status === "COMPLETED" || status === "CANCELLED";
  });
  const statusOf = (tournamentId: string) =>
    (isSupabaseConfigured() ? remoteRegistrations : db.registrations).find(
      (registration) =>
        registration.tournamentId === tournamentId && registration.athleteId === participationId,
    )?.status;

  return (
    <Page>
      <SectionHeading
        compact
        eyebrow="My sports"
        title="Tournaments you're part of"
        action={
          <Button asChild variant="outline">
            <Link to="/tournaments">Find more</Link>
          </Button>
        }
      />

      {loadError ? (
        <EmptyState title="Your registrations could not be loaded." description={loadError} />
      ) : loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground" role="status">
          Loading your tournaments…
        </p>
      ) : all.length === 0 ? (
        <EmptyState
          title="You haven't registered yet."
          description="Explore open tournaments and register in a couple of taps."
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
                  <TournamentCard
                    key={t.id}
                    tournament={t}
                    footnote={`Registration: ${statusOf(t.id)}`}
                  />
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
