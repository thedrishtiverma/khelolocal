import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Page } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { SportIcon } from "@/components/shared/SportIcon";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Sports in Indore | KheloLocal" },
      {
        name: "description",
        content: "Find your sport, local tournaments, athletes and sporting communities in Indore.",
      },
    ],
  }),
  component: SportsPage,
});

function SportsPage() {
  const { db } = useKhelo();
  const requestedSports = [
    "Cricket",
    "Football",
    "Volleyball",
    "Kabaddi",
    "Badminton",
    "Boxing",
    "Basketball",
    "Table Tennis",
    "Tennis",
    "Athletics",
    "Kho-Kho",
    "Yoga",
  ];
  const sports = requestedSports.map(
    (name) =>
      db.sports.find((sport) => sport.name === name) ?? {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
      },
  );
  return (
    <div>
      <NetworkHero
        tone="sports"
        eyebrow="Sport × city"
        title={
          <>
            Find your <span className="text-lime">sport.</span> Find your people.
          </>
        }
        description="Explore the local tournaments, athletes, teams and institutions behind every game in Indore."
        highlights={["Players", "Fixtures", "Teams"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sports.map((sport) => {
            return (
              <Link
                key={sport.id}
                to="/sports/$sport"
                params={{ sport: sport.id }}
                className={`sport-card sport-card-${sport.id} group overflow-hidden rounded-2xl border border-border bg-card p-0`}
              >
                <div className="sport-card-banner">
                  <div className="profile-banner-lines absolute inset-0" />
                  <SportIcon
                    sportId={sport.id}
                    className="relative z-10 size-10"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 ml-auto font-ui text-[10px] font-bold uppercase tracking-[0.18em]">
                    {sport.name} / Indore
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="sport-discovery-name font-display text-2xl font-black uppercase transition-colors">
                    {sport.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Players, fixtures and local teams
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold group-hover:text-lime">
                    Explore {sport.name} <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Page>
    </div>
  );
}
