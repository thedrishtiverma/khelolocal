import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, Building2, MapPin, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
// @ts-expect-error This small data-only package does not ship TypeScript declarations.
import indiaMap from "@svg-maps/india";
import { Page, SectionHeading } from "@/components/shared/Bits";
import { Button } from "@/components/ui/button";
import { useKhelo } from "@/lib/services/store";
import { BrandName } from "@/components/shared/BrandName";
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

type IndiaMap = {
  viewBox: string;
  locations: { id: string; name: string; path: string }[];
};

type MapStage = "india" | "indore" | "areas";

const INDIA = indiaMap as IndiaMap;
const AREA_MARKERS = [
  { id: "zone_vijay_nagar", x: 244, y: 323, label: "Vijay Nagar" },
  { id: "zone_palasia", x: 253, y: 334, label: "Palasia" },
  { id: "zone_bhawarkua", x: 236, y: 342, label: "Bhawarkua" },
  { id: "zone_rau", x: 220, y: 352, label: "Rau" },
];

function SportsMapPage() {
  const { db } = useKhelo();
  const [filter, setFilter] = useState<"ALL" | SubmissionKind>("ALL");
  const [zoneId, setZoneId] = useState("zone_vijay_nagar");
  const [stage, setStage] = useState<MapStage>("india");
  const zone = db.zones.find((item) => item.id === zoneId) ?? db.zones[0];
  const records = db.fieldSubmissions.filter(
    (record) =>
      record.zoneId === zone?.id &&
      record.status === "VERIFIED" &&
      (filter === "ALL" || record.kind === filter),
  );
  const zoneTournaments = db.tournaments.filter((tournament) => tournament.cityId === "indore");

  useEffect(() => {
    const indoreTimer = window.setTimeout(() => setStage("indore"), 1250);
    const areasTimer = window.setTimeout(() => setStage("areas"), 2850);
    return () => {
      window.clearTimeout(indoreTimer);
      window.clearTimeout(areasTimer);
    };
  }, []);

  return (
    <Page className="py-6 sm:py-10">
      <section className="india-map-story overflow-hidden rounded-2xl border border-border">
        <div className="india-map-copy">
          <p className="india-map-kicker">
            <span className="live-dot" /> <BrandName /> / India
          </p>
          <h1 className="font-display text-4xl font-black uppercase leading-[0.88] sm:text-6xl">
            A country of games.
            <br />
            <span className="text-lime">One home ground.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-surface-foreground/70 sm:text-base">
            Sport is already happening everywhere. <BrandName /> starts by connecting one city —
            then the neighbourhoods inside it.
          </p>
          <div className="india-map-steps mt-7" aria-label="Map journey">
            {(["india", "indore", "areas"] as MapStage[]).map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => setStage(item)}
                aria-pressed={stage === item}
                className={stage === item ? "active" : ""}
              >
                <span>0{index + 1}</span>
                {item === "india" ? "India" : item === "indore" ? "Indore" : "Areas"}
              </button>
            ))}
          </div>
        </div>
        <div className="india-map-viewport" data-stage={stage}>
          <div className="india-map-status">
            <span className="live-dot" />{" "}
            {stage === "india"
              ? "India / overview"
              : stage === "indore"
                ? "Madhya Pradesh / Indore"
                : "Indore / local areas"}
          </div>
          <svg
            className="india-map-svg"
            viewBox={INDIA.viewBox}
            role="img"
            aria-label="Map of India, focusing on Indore in Madhya Pradesh"
          >
            <g className="india-map-shape">
              {INDIA.locations.map((location) => (
                <path
                  key={location.id}
                  d={location.path}
                  className={location.id === "mp" ? "india-state indore-state" : "india-state"}
                />
              ))}
              <g className="indore-marker">
                <circle cx="244" cy="323" r="5" />
                <circle className="indore-marker-pulse" cx="244" cy="323" r="10" />
                <text x="256" y="317">
                  INDORE
                </text>
              </g>
              <g className="india-area-markers">
                {AREA_MARKERS.map((area) => (
                  <g
                    key={area.id}
                    className={zoneId === area.id ? "active" : ""}
                    onClick={() => {
                      setZoneId(area.id);
                      setStage("areas");
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <circle cx={area.x} cy={area.y} r="3.5" />
                    <text x={area.x + 7} y={area.y - 5}>
                      {area.label}
                    </text>
                  </g>
                ))}
              </g>
            </g>
          </svg>
          <p className="india-map-caption">
            {stage === "india"
              ? "India first. The local network begins with a single point."
              : stage === "indore"
                ? "Zooming in on Indore, Madhya Pradesh."
                : "Choose an area to explore what is happening nearby."}
          </p>
          <ArrowDownRight className="india-map-direction" aria-hidden="true" />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="india-map-detail rounded-2xl border border-border p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
            From country to street
          </p>
          <h2 className="mt-4 font-display text-3xl font-black uppercase">
            The local game, made visible.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            The map moves from the national picture to Indore, then into the places where players
            actually meet, train and compete.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [Trophy, db.tournaments.length, "Tournaments"],
              [
                Building2,
                db.fieldSubmissions.filter((r) => r.status === "VERIFIED").length,
                "Verified places",
              ],
              [Users, db.athletes.length, "Athletes"],
            ].map(([Icon, value, label]) => {
              const StatIcon = Icon as typeof Trophy;
              return (
                <div key={label as string} className="border-l border-border pl-4">
                  <StatIcon className="size-5 text-lime" />
                  <p className="stat-num mt-4 text-3xl">{value as number}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label as string}
                  </p>
                </div>
              );
            })}
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
            Select an area on the map to see verified sports activity nearby.
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
  );
}
