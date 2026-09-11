import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Minus, Plus, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Button } from "@/components/ui/button";
import { useKhelo } from "@/lib/services/store";
import type { SubmissionKind } from "@/types";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Sports map of Indore | KheloLocal" },
      {
        name: "description",
        content:
          "Explore sports zones, venues, academies, tournaments and local opportunities across Indore.",
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

function SportsMapPage() {
  const { db } = useKhelo();
  const [filter, setFilter] = useState<"ALL" | SubmissionKind>("ALL");
  const [zoneId, setZoneId] = useState("zone_vijay_nagar");
  const [zoom, setZoom] = useState(1);
  const [layer, setLayer] = useState<"network" | "tournaments" | "athletes">("network");
  const [indiaFocus, setIndiaFocus] = useState(false);
  const zone = db.zones.find((item) => item.id === zoneId) ?? db.zones[0];
  const records = db.fieldSubmissions.filter(
    (record) =>
      record.zoneId === zone?.id &&
      record.status === "VERIFIED" &&
      (filter === "ALL" || record.kind === filter),
  );
  const zoneTournaments = db.tournaments.filter((tournament) => tournament.cityId === "indore");

  useEffect(() => {
    const timer = window.setTimeout(() => setIndiaFocus(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div>
      <NetworkHero
        tone="explore"
        eyebrow="India / city network"
        title={
          <>
            Start with India. <span className="text-lime">Zoom into Indore.</span>
          </>
        }
        description="See how KheloLocal can grow city by city. The live field layer starts in Indore, with every future city ready to plug into the network."
        highlights={["Cities", "Local sport", "Live layers"]}
      />
      <Page className="py-10 sm:py-16">
        <section
          className={`india-map-overview ${indiaFocus ? "is-focused" : ""}`}
          aria-label="India city network preview"
        >
          <div className="india-map-copy">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
              City network / India
            </p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase">
              Every city gets a home ground.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              The overview shows the future network. The map automatically settles on Indore, where
              verified local data is live today.
            </p>
          </div>
          <div className="india-map-plate" aria-hidden="true">
            <span className="india-map-outline" />
            <span className="city-node city-node-delhi">Delhi</span>
            <span className="city-node city-node-mumbai">Mumbai</span>
            <span className="city-node city-node-bengaluru">Bengaluru</span>
            <button
              type="button"
              className="city-node city-node-indore"
              onClick={() => setIndiaFocus(true)}
              aria-label="Focus Indore"
            >
              Indore
            </button>
            <span className="india-map-signal" />
          </div>
        </section>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="data-card overflow-hidden rounded-2xl p-0">
            <div className="city-map relative min-h-[520px] overflow-hidden p-6 sm:p-8">
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
              <div className="absolute left-5 top-5 z-20 flex flex-wrap gap-2">
                {[
                  ["network", "Areas"],
                  ["tournaments", "Tournaments"],
                  ["athletes", "Athletes"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLayer(value as typeof layer)}
                    className={`map-layer-button ${layer === value ? "active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="city-map-canvas" style={{ transform: `scale(${zoom})` }}>
                {db.zones.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setZoneId(item.id);
                      setZoom((value) => Math.max(value, 1.35));
                    }}
                    className={`map-pin absolute flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-sm transition-transform hover:scale-105 ${zoneId === item.id ? "active" : ""}`}
                    style={{ left: `${18 + (index % 2) * 43}%`, top: `${20 + index * 17}%` }}
                    aria-pressed={zoneId === item.id}
                  >
                    <MapPin className="size-3.5" /> {item.name}
                  </button>
                ))}
                {layer === "tournaments"
                  ? db.tournaments.slice(0, 8).map((tournament, index) => (
                      <span
                        key={tournament.id}
                        className="map-popover map-popover-tournament"
                        style={{
                          left: `${10 + ((index * 19) % 75)}%`,
                          top: `${34 + ((index * 13) % 45)}%`,
                        }}
                      >
                        <Trophy className="size-3" /> {tournament.sportName}
                      </span>
                    ))
                  : null}
                {layer === "athletes"
                  ? db.athletes.slice(0, 8).map((athlete, index) => (
                      <span
                        key={athlete.id}
                        className="map-popover map-popover-athlete"
                        style={{
                          left: `${8 + ((index * 23) % 78)}%`,
                          top: `${30 + ((index * 17) % 48)}%`,
                        }}
                      >
                        <Users className="size-3" /> {athlete.name}
                      </span>
                    ))
                  : null}
              </div>
              <div className="absolute bottom-6 left-6 max-w-xs sm:left-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Indore / live field map
                </p>
                <p className="mt-2 font-display text-3xl font-black uppercase">
                  Play is everywhere.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Select a zone to see verified local sports information.
                </p>
              </div>
            </div>
          </section>

          <section className="data-card rounded-2xl p-6 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Selected zone
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
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Click an area to focus it. Zoom in to reveal the organizations, sports and events
              appearing across that part of Indore.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 border-y border-border py-5">
              <div>
                <p className="stat-num text-2xl">{records.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Verified nearby
                </p>
              </div>
              <div>
                <p className="stat-num text-2xl">{zoneTournaments.length}</p>
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
          <SectionHeading eyebrow="The local network" title="What the map connects" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Trophy,
                title: "Tournaments",
                value: db.tournaments.length,
                body: "Competitions happening across the city.",
              },
              {
                icon: Building2,
                title: "Venues & academies",
                value: db.fieldSubmissions.filter((r) => r.status === "VERIFIED").length,
                body: "Grounds, turfs, courts and coaching spaces.",
              },
              {
                icon: Users,
                title: "Athletes",
                value: db.athletes.length,
                body: "Players building a sporting identity.",
              },
            ].map(({ icon: Icon, title, value, body }) => (
              <article key={title} className="data-card-muted rounded-xl border border-border p-5">
                <Icon className="size-5 text-lime" />
                <p className="stat-num mt-5 text-3xl">{value}</p>
                <h3 className="mt-2 font-display text-xl font-bold uppercase">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </Page>
    </div>
  );
}
