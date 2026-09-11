import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Minus, Plus, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Button } from "@/components/ui/button";
import { useKhelo } from "@/lib/services/store";
import type { SubmissionKind } from "@/types";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Indore sports map | KheloLocal" },
      {
        name: "description",
        content:
          "Explore Indore areas, organizers, tournaments and athletes on the KheloLocal sports map.",
      },
    ],
  }),
  component: SportsMapPage,
});

const FILTERS: { value: "ALL" | SubmissionKind; label: string }[] = [
  { value: "ALL", label: "Everything" },
  { value: "TOURNAMENT", label: "Tournaments" },
  { value: "VENUE", label: "Venues" },
  { value: "ACADEMY", label: "Academies" },
  { value: "OPPORTUNITY", label: "Opportunities" },
];

type Layer = "areas" | "organizers" | "tournaments" | "athletes";

function SportsMapPage() {
  const { db } = useKhelo();
  const [filter, setFilter] = useState<"ALL" | SubmissionKind>("ALL");
  const [zoneId, setZoneId] = useState("zone_vijay_nagar");
  const [zoom, setZoom] = useState(1);
  const [layer, setLayer] = useState<Layer>("areas");
  const zone = db.zones.find((item) => item.id === zoneId) ?? db.zones[0];
  const records = db.fieldSubmissions.filter(
    (record) =>
      record.zoneId === zone?.id &&
      record.status === "VERIFIED" &&
      (filter === "ALL" || record.kind === filter),
  );
  const tournaments = db.tournaments.filter((item) => item.cityId === "indore");
  const athletes = db.athletes.filter((item) => item.cityId === "indore");
  const organizers = db.organizers.filter((item) => item.cityId === "indore");

  return (
    <div>
      <NetworkHero
        tone="explore"
        eyebrow="Indore / live sports map"
        title={
          <>
            Find the game <span className="text-lime">around you.</span>
          </>
        }
        description="Start with an area, then switch layers to see the organizers, tournaments and athletes making local sport happen."
        highlights={["Areas", "Events", "People"]}
      />
      <Page className="py-10 sm:py-16">
        <div className="map-page-shell grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="data-card overflow-hidden rounded-2xl p-0">
            <div className="city-map relative min-h-[520px] overflow-hidden">
              <div className="absolute left-5 top-5 z-20 flex flex-wrap gap-2">
                {(
                  [
                    ["areas", "Areas"],
                    ["organizers", "Organizers"],
                    ["tournaments", "Tournaments"],
                    ["athletes", "Athletes"],
                  ] as [Layer, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`map-layer-button ${layer === value ? "active" : ""}`}
                    onClick={() => setLayer(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="absolute right-5 top-5 z-20 flex flex-col gap-2">
                <button
                  type="button"
                  className="map-control"
                  onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}
                  aria-label="Zoom in"
                >
                  <Plus className="size-4" />
                </button>
                <button
                  type="button"
                  className="map-control"
                  onClick={() => setZoom((value) => Math.max(1, value - 0.2))}
                  aria-label="Zoom out"
                >
                  <Minus className="size-4" />
                </button>
              </div>
              <div className="indore-map-canvas" style={{ transform: `scale(${zoom})` }}>
                <div className="indore-map-grid" aria-hidden="true" />
                {db.zones.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setZoneId(item.id);
                      setLayer("areas");
                      setZoom((value) => Math.max(value, 1.25));
                    }}
                    className={`map-pin absolute flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-sm transition-transform hover:scale-105 ${zoneId === item.id && layer === "areas" ? "active" : ""}`}
                    style={{ left: `${18 + (index % 2) * 43}%`, top: `${22 + index * 17}%` }}
                  >
                    <MapPin className="size-3.5" /> {item.name}
                  </button>
                ))}
                {layer === "organizers"
                  ? organizers.map((item, index) => (
                      <span
                        key={item.id}
                        className="map-popover map-popover-organizer"
                        style={{
                          left: `${12 + ((index * 25) % 72)}%`,
                          top: `${32 + ((index * 19) % 42)}%`,
                        }}
                      >
                        <Building2 className="size-3" /> {item.organizationName}
                      </span>
                    ))
                  : null}
                {layer === "tournaments"
                  ? tournaments.slice(0, 8).map((item, index) => (
                      <span
                        key={item.id}
                        className="map-popover map-popover-tournament"
                        style={{
                          left: `${10 + ((index * 19) % 75)}%`,
                          top: `${34 + ((index * 13) % 45)}%`,
                        }}
                      >
                        <Trophy className="size-3" /> {item.sportName}
                      </span>
                    ))
                  : null}
                {layer === "athletes"
                  ? athletes.slice(0, 8).map((item, index) => (
                      <span
                        key={item.id}
                        className="map-popover map-popover-athlete"
                        style={{
                          left: `${8 + ((index * 23) % 78)}%`,
                          top: `${30 + ((index * 17) % 48)}%`,
                        }}
                      >
                        <Users className="size-3" /> {item.name}
                      </span>
                    ))
                  : null}
              </div>
              <div className="absolute bottom-6 left-6 z-10 max-w-xs sm:left-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Indore / {layer}
                </p>
                <p className="mt-2 font-display text-3xl font-black uppercase">
                  Play is everywhere.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Choose an area or layer to see what is happening across the city.
                </p>
              </div>
            </div>
          </section>
          <section className="data-card rounded-2xl p-6 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Selected area
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase">{zone?.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-lime" /> {zone?.localities.join(" · ")}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant={filter === item.value ? "default" : "outline"}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 border-y border-border py-5">
              <div>
                <p className="stat-num text-2xl">{records.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Verified nearby
                </p>
              </div>
              <div>
                <p className="stat-num text-2xl">{tournaments.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  City tournaments
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {records.length ? (
                records.map((record) => (
                  <article key={record.id} className="border-l-2 border-lime pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {record.kind}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold">{record.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {record.address || record.notes}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No verified records in this category yet.
                </p>
              )}
            </div>
          </section>
        </div>
        <section className="mt-14 border-t border-border pt-10">
          <SectionHeading eyebrow="The local network" title="What the Indore map connects" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [
                Trophy,
                tournaments.length,
                "Tournaments",
                "Competitions happening across the city.",
              ],
              [
                Building2,
                organizers.length,
                "Organizers",
                "People and organizations running local sport.",
              ],
              [Users, athletes.length, "Athletes", "Players building a sporting identity."],
            ].map(([Icon, value, title, body]) => {
              const CardIcon = Icon as typeof Trophy;
              return (
                <article
                  key={title as string}
                  className="data-card-muted rounded-xl border border-border p-5"
                >
                  <CardIcon className="size-5 text-lime" />
                  <p className="stat-num mt-5 text-3xl">{value as number}</p>
                  <h3 className="mt-2 font-display text-xl font-bold uppercase">
                    {title as string}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body as string}</p>
                </article>
              );
            })}
          </div>
        </section>
      </Page>
    </div>
  );
}
