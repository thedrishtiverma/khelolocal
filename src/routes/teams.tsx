import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";
import { SportIcon } from "@/components/shared/SportIcon";
import { RoleIcon } from "@/components/shared/KheloIcon";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams | KheloLocal" },
      {
        name: "description",
        content: "Find local teams, their tournament history and the players behind them.",
      },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const { db } = useKhelo();
  return (
    <div>
      <NetworkHero
        tone="athletes"
        eyebrow="Team discovery"
        title={
          <>
            Find your side. <span className="text-lime">Make it yours.</span>
          </>
        }
        description="Discover the local teams, rosters and records that turn individual players into a side."
        highlights={["Rosters", "Fixtures", "Records"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {db.teams.map((team) => (
            <article key={team.id} className="team-card data-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
                  <SportIcon sportId={team.sportId} className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="team-card-name flex items-center gap-2 font-display text-2xl font-black uppercase transition-colors">
                    <RoleIcon role="team" className="size-6 shrink-0 text-lime" />
                    {team.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {team.sportName} · {team.cityName}
                  </p>
                </div>
              </div>
              <div className="mt-7 flex gap-6 border-t border-border pt-5 text-sm">
                <span>
                  <strong>{team.players.length}</strong> players
                </span>
                <span>
                  <strong>{db.tournaments.filter((t) => t.sportId === team.sportId).length}</strong>{" "}
                  tournaments
                </span>
              </div>
            </article>
          ))}
        </div>
        <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [Users, "Discover teams", "Find the people you want to play alongside."],
            [Trophy, "Team achievements", "See the results a side has earned together."],
            [
              ArrowRight,
              "Join a team",
              "Build your sporting profile and make the next connection.",
            ],
          ].map(([Icon, title, body]) => {
            const IconComponent = Icon as React.ComponentType<{ className?: string }>;
            return (
              <Link
                key={title as string}
                to="/athletes"
                className="data-card-muted rounded-xl border border-border p-6"
              >
                <IconComponent className="size-5 text-lime" />
                <h2 className="mt-7 font-display text-xl font-bold uppercase">{title as string}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{body as string}</p>
              </Link>
            );
          })}
        </section>
      </Page>
    </div>
  );
}
