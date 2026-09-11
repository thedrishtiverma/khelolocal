import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Trophy, Users } from "lucide-react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";

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
            <article key={team.id} className="data-card rounded-2xl p-6">
              <Shield className="size-7 text-lime" />
              <h2 className="mt-8 font-display text-2xl font-black uppercase">{team.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {team.sportName} · {team.cityName}
              </p>
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
