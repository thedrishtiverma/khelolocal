import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Page } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/cities/")({
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
        description={
          <>
            City by city,{" "}
            <span className="brand-inline font-semibold">
              Khelo<span>Local</span>
            </span>{" "}
            turns everyday games into a trusted sporting network. Every city is a home ground.
          </>
        }
        highlights={["Local", "Connected", "Growing"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {db.cities
            .filter((city) => city.active)
            .map((city) => (
              <Link
                key={city.id}
                to="/cities/$city"
                params={{ city: city.id }}
                className="city-network-card data-card group rounded-2xl"
              >
                <div className={`city-card-banner city-card-banner-${city.id}`}>
                  <div className="city-card-map-art" aria-hidden="true" />
                  <span className="city-card-location">
                    <MapPin className="size-4" />
                    {city.state}, {city.country}
                  </span>
                  <svg
                    className="city-card-skyline"
                    viewBox="0 0 420 150"
                    preserveAspectRatio="xMaxYMax meet"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 148V92h29V67h20v81h21V83h30v65h15V51h25v97h17V75h30v73h22V37h27v111h19V69h31v79h22V91h26v57h25V57h26v91h34v2H0z"
                      fill="currentColor"
                      opacity=".2"
                    />
                    <path
                      d="M0 148h420M108 148v-43h29v43m96 0V80h30v68m49 0V98h29v50m43 0v-62h27v62"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      opacity=".45"
                    />
                  </svg>
                  <span className="city-card-banner-label">CITY NETWORK · 01</span>
                </div>
                <div className="p-6">
                  <h2 className="font-display text-3xl font-black uppercase">{city.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {city.state}, {city.country}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold group-hover:text-lime">
                    Explore this city <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </Page>
    </div>
  );
}
