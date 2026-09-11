import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Trophy, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";
import { SportIcon } from "@/components/shared/SportIcon";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams in Indore | KheloLocal" },
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
            Find your team. <span className="text-lime">Build yours.</span>
          </>
        }
        description="Discover the local teams, rosters and records that turn individual players into a side."
        highlights={["Rosters", "Fixtures", "Records"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {db.teams.map((team) => (
            <article key={team.id} className="team-card data-card overflow-hidden rounded-2xl p-0">
              <div
                className={`team-card-banner team-card-banner-${team.sportId} relative flex min-h-32 items-end justify-between overflow-hidden px-6 pb-5`}
              >
                <div className="relative z-10 flex items-center gap-3 text-surface-foreground">
                  <SportIcon sportId={team.sportId} className="size-8" aria-hidden="true" />
                  <span className="font-ui text-[10px] font-bold uppercase tracking-[0.18em]">
                    {team.sportName}
                  </span>
                </div>
                <Shield className="relative z-10 size-7 text-lime" />
              </div>
              <div className="p-6">
                <h2 className="team-card-name font-display text-2xl font-black uppercase transition-colors">
                  {team.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {team.sportName} · {team.cityName}
                </p>
                <div className="mt-7 flex gap-6 border-t border-border pt-5 text-sm">
                  <span>
                    <strong>{team.players.length}</strong> players
                  </span>
                  <span>
                    <strong>
                      {db.tournaments.filter((t) => t.sportId === team.sportId).length}
                    </strong>{" "}
                    tournaments
                  </span>
                </div>
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
          ].map(([Icon, title, body]) => (
            <Link
              key={title as string}
              to="/athletes"
              className="data-card-muted rounded-xl border border-border p-6"
            >
              <Icon className="size-5 text-lime" />
              <h2 className="mt-7 font-display text-xl font-bold uppercase">{title as string}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body as string}</p>
            </Link>
          ))}
        </section>
      </Page>
    </div>
  );
}
