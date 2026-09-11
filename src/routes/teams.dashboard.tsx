import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Shield, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/teams/dashboard")({
  head: () => ({ meta: [{ title: "Team dashboard | KheloLocal" }] }),
  component: TeamDashboard,
});

function TeamDashboard() {
  const { db, currentUser } = useKhelo();
  const team = db.teams[0];
  if (!currentUser || currentUser.role !== "SCOUT")
    return (
      <Page>
        <EmptyState
          title="Team demo dashboard"
          description="Use the Scout / Coach / Team demo account to open the team workspace."
          action={
            <Button asChild>
              <Link to="/login">Open demo login</Link>
            </Button>
          }
        />
      </Page>
    );
  if (!team)
    return (
      <Page>
        <EmptyState
          title="No demo team yet"
          description="Create a team to start managing a roster."
        />
      </Page>
    );
  return (
    <Page className="py-10 sm:py-16">
      <section className="surface-panel rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-foreground/60">
          Team workspace
        </p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase">{team.name}</h1>
        <p className="mt-2 text-sm text-surface-foreground/70">
          {team.sportName} · {team.cityName}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 border-t border-surface-foreground/15 pt-6 sm:grid-cols-3">
          <Stat tone="invert" value={team.players.length} label="Players" />
          <Stat
            tone="invert"
            value={
              db.tournaments.filter((tournament) => tournament.sportId === team.sportId).length
            }
            label="Tournaments"
          />
          <Stat
            tone="accent"
            value={db.matches.filter((match) => match.status === "COMPLETED").length}
            label="Completed matches"
          />
        </div>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/athletes">
            <UserPlus className="size-4" /> Find players
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/tournaments">
            <CalendarDays className="size-4" /> View fixtures
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/teams">
            <Shield className="size-4" /> Team directory
          </Link>
        </Button>
      </div>
      <section className="mt-12">
        <SectionHeading title="Roster" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {team.players.map((playerId) => {
            const player = db.athletes.find((athlete) => athlete.id === playerId);
            return player ? (
              <article key={player.id} className="data-card rounded-xl p-5">
                <Users className="size-5 text-lime" />
                <h2 className="mt-5 font-display text-xl font-bold uppercase">{player.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {player.position || player.primarySport}
                </p>
              </article>
            ) : null;
          })}
        </div>
      </section>
    </Page>
  );
}
