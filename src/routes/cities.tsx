import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Page } from "@/components/shared/Bits";
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
    <Page className="py-14 sm:py-24">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
        KheloLocal cities
      </p>
      <h1 className="mt-5 max-w-3xl font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
        A sporting network, built city by city.
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
        We begin by making local sport easier to find, play and remember. Indore is home ground.
      </p>
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
  );
}
