import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin, Trophy, Users } from "lucide-react";
import { LoadingBlock, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { SportIcon } from "@/components/shared/SportIcon";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/cities/$city")({
  head: ({ params }) => {
    const cityName = params.city
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      meta: [
        { title: `${cityName} City | KheloLocal` },
        {
          name: "description",
          content: `Explore the athletes, tournaments, institutions and sporting places of ${cityName}.`,
        },
      ],
    };
  },
  component: CityPage,
});

function CityPage() {
  const { city: cityId } = Route.useParams();
  const { db, hydrated } = useKhelo();
  const city = db.cities.find((item) => item.id === cityId && item.active);

  if (!city) {
    if (!hydrated) return <LoadingBlock label="Loading city..." />;
    throw notFound();
  }

  const athletes = db.athletes.filter((item) => item.cityId === city.id);
  const tournaments = db.tournaments.filter((item) => item.cityId === city.id);
  const colleges = db.colleges.filter((item) => item.cityId === city.id);
  const zones = db.zones.filter((item) => item.cityId === city.id);
  const sports = db.sports.filter((item) => item.active).slice(0, 6);
  const otherCities = db.cities.filter((item) => item.active && item.id !== city.id);

  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow={`KheloLocal / ${city.name}`}
        title={
          <>
            This is our <span className="text-lime">home ground.</span>
          </>
        }
        description={`Find the athletes, tournaments, institutions and everyday playing spaces that make ${city.name}'s sporting network move.`}
        highlights={["Local players", "Open grounds", "Live events"]}
        actions={
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Open the {city.name} map <ArrowRight className="size-4" />
          </Link>
        }
      />
      <Page className="py-14 sm:py-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={athletes.length} label="Athletes" />
          <Stat value={tournaments.length} label="Tournaments" />
          <Stat value={colleges.length} label="Institutions" />
          <Stat tone="accent" value={zones.length} label="City zones" />
        </div>
        <section className="mt-16">
          <SectionHeading
            eyebrow="The city network"
            title={`${city.name}, mapped for sport.`}
            subtitle={`${city.state} · Find what is happening close to you.`}
          />
          {zones.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {zones.map((zone) => (
                <Link key={zone.id} to="/map" className="data-card group rounded-xl p-5">
                  <MapPin className="size-5 text-lime" />
                  <h2 className="mt-8 font-display text-xl font-bold uppercase">{zone.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {zone.localities.join(" · ")}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold group-hover:text-lime">
                    Focus zone <ArrowRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              City zones are being added. Check back soon.
            </p>
          )}
        </section>
        <section className="mt-16">
          <SectionHeading
            eyebrow="Pick your game"
            title="Every sport has a local signal."
            action={
              <Link to="/sports" className="text-sm font-bold hover:text-lime">
                All sports <ArrowRight className="inline size-4" />
              </Link>
            }
          />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                to="/sports/$sport"
                params={{ sport: sport.id }}
                className="data-card-muted rounded-xl border border-border p-4 hover:border-lime"
              >
                <SportIcon sportId={sport.id} className="size-6 text-lime" />
                <h2 className="mt-5 font-display text-lg font-bold uppercase">{sport.name}</h2>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Trophy,
              title: "Find tournaments",
              body: `See what is open, live and coming up across ${city.name}.`,
              to: "/tournaments" as const,
            },
            {
              icon: Users,
              title: "Meet athletes",
              body: "Discover players by sport, position and verified experience.",
              to: "/athletes" as const,
            },
            {
              icon: Building2,
              title: "See institutions",
              body: "Follow the colleges and organizations building local sport.",
              to: "/institutions" as const,
            },
          ].map(({ icon: Icon, title, body, to }) => (
            <Link key={title} to={to} className="data-card rounded-xl p-6">
              <Icon className="size-6 text-lime" />
              <h2 className="mt-8 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              <ArrowRight className="mt-6 size-4 text-lime" />
            </Link>
          ))}
        </section>
        {otherCities.length ? (
          <section className="mt-16">
            <SectionHeading eyebrow="Keep exploring" title="More city networks." />
            <div className="grid gap-4 sm:grid-cols-2">
              {otherCities.map((otherCity) => (
                <Link
                  key={otherCity.id}
                  to="/cities/$city"
                  params={{ city: otherCity.id }}
                  className="data-card group rounded-xl p-5"
                >
                  <MapPin className="size-5 text-lime" />
                  <h2 className="mt-5 font-display text-xl font-bold uppercase">
                    {otherCity.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {otherCity.state}, {otherCity.country}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Page>
    </div>
  );
}
