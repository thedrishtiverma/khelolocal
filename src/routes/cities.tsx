import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Page } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/cities")({
  head: () => ({
    meta: [
      { title: "Our cities | KheloLocal" },
      {
        name: "description",
        content: "KheloLocal is building the local sports network city by city.",
      },
    ],
  }),
  component: CitiesPage,
});

function CitiesPage() {
  const { db } = useKhelo();
  return (
    <div>
      <NetworkHero
        tone="community"
        eyebrow="KheloLocal cities"
        title={
          <>
            A sporting network, built <span className="text-lime">city by city.</span>
          </>
        }
        description="We begin by making local sport easier to find, play and remember. Indore is home ground."
        highlights={["Local", "Connected", "Growing"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {db.cities
            .filter((city) => city.active)
            .map((city) => (
              <Link key={city.id} to="/explore" className="data-card group rounded-2xl p-7">
                <MapPin className="size-7 text-lime" />
                <h2 className="mt-12 font-display text-3xl font-black uppercase">{city.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {city.state}, {city.country}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold group-hover:text-lime">
                  Explore this city <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
        </div>
      </Page>
    </div>
  );
}
