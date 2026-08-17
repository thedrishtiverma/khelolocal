import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { useKhelo } from "@/lib/services/store";
import { searchAthletes, type AthleteFilters } from "@/lib/services/selectors";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover verified local athletes | KheloLocal" },
      {
        name: "description",
        content:
          "Scouts, coaches and teams: search Indore athletes by sport, age category and position, with organizer-verified tournament records.",
      },
      { property: "og:title", content: "Discover verified local athletes" },
      {
        property: "og:description",
        content: "Search grassroots talent backed by verified tournament results.",
      },
    ],
  }),
  component: DiscoverPage,
});

const POSITIONS = [
  { value: "FORWARD", label: "Forward" },
  { value: "MIDFIELD", label: "Midfield" },
  { value: "DEFENCE", label: "Defence" },
  { value: "GOALKEEPER", label: "Goalkeeper" },
  { value: "RAIDER", label: "Raider" },
  { value: "DEFENDER", label: "Defender" },
  { value: "ALL_ROUNDER", label: "All-rounder" },
];

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(value === o.value ? undefined : o.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              value === o.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DiscoverPage() {
  const { db } = useKhelo();
  const [filters, setFilters] = useState<AthleteFilters>({});
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchAthletes(db, { ...filters, query }),
    [db, filters, query],
  );

  const set = <K extends keyof AthleteFilters>(key: K, value: AthleteFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  return (
    <Page>
      <SectionHeading
        eyebrow="Talent discovery"
        title="Find verified athletes in your city"
        subtitle="Every stat below comes from a tournament result verified by the organizer who ran it."
      />

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search athletes by name"
            className="pl-9"
          />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Chips
            label="Sport"
            options={db.sports.map((s) => ({ value: s.id, label: s.name }))}
            value={filters.sportId}
            onChange={(v) => set("sportId", v)}
          />
          <Chips
            label="Age category"
            options={["U14", "U16", "U18", "U21", "Open"].map((a) => ({ value: a, label: a }))}
            value={filters.ageCategory}
            onChange={(v) => set("ageCategory", v)}
          />
          <Chips
            label="Position"
            options={POSITIONS}
            value={filters.positionGroup}
            onChange={(v) => set("positionGroup", v)}
          />
          <Chips
            label="Minimum tournaments played"
            options={[
              { value: "1", label: "1+" },
              { value: "3", label: "3+" },
              { value: "5", label: "5+" },
            ]}
            value={filters.minVerifiedTournaments?.toString()}
            onChange={(v) => set("minVerifiedTournaments", v ? Number(v) : undefined)}
          />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="stat-num text-sm text-muted-foreground">{results.length} athletes</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({});
              setQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {results.length === 0 ? (
          <EmptyState
            title="No athletes match these filters."
            description="Try widening the sport or age category."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => (
              <AthleteCard key={a.id} athlete={a} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}