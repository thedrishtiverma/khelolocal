import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Trophy, Users } from "lucide-react";
import { useState } from "react";
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
  const zone = db.zones.find((item) => item.id === zoneId) ?? db.zones[0];
  const records = db.fieldSubmissions.filter(
    (record) =>
      record.zoneId === zone?.id &&
      record.status === "VERIFIED" &&
      (filter === "ALL" || record.kind === filter),
  );
  const zoneTournaments = db.tournaments.filter((tournament) => tournament.cityId === "indore");

  return (
    <div>
      <NetworkHero
        tone="explore"
        eyebrow="Sports near you"
        title={
          <>
            Map the game <span className="text-lime">in Indore.</span>
          </>
        }
        description="Find the grounds, academies, tournaments and local opportunities that keep your city moving."
        highlights={["Grounds", "Events", "Opportunities"]}
      />
      <Page className="py-10 sm:py-16">
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="data-card overflow-hidden rounded-2xl p-0">
            <div className="city-map relative min-h-[420px] overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 opacity-50" aria-hidden="true" />
              {db.zones.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setZoneId(item.id)}
                  className={`map-pin absolute flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-sm transition-transform hover:scale-105 ${zoneId === item.id ? "active" : ""}`}
                  style={{ left: `${18 + (index % 2) * 43}%`, top: `${20 + index * 17}%` }}
                  aria-pressed={zoneId === item.id}
                >
                  <MapPin className="size-3.5" /> {item.name}
                </button>
              ))}
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
