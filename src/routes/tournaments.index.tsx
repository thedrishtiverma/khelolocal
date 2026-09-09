import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useKhelo } from "@/lib/services/store";
import { searchTournaments } from "@/lib/services/selectors";

export const Route = createFileRoute("/tournaments/")({
  head: () => ({
    meta: [
      { title: "Sports near you — Tournaments in Indore | KheloLocal" },
      {
        name: "description",
        content:
          "Browse football and kabaddi tournaments in Indore. Filter by sport, age category, gender and status.",
      },
      { property: "og:title", content: "Sports near you — Tournaments in Indore" },
      {
        property: "og:description",
        content: "Find local football and kabaddi tournaments open for registration in Indore.",
      },
    ],
  }),
  component: ExploreTournaments,
});

const SELECT = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium";

function ExploreTournaments() {
  const { db } = useKhelo();
  const [sportId, setSportId] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [genderCategory, setGenderCategory] = useState("");
  const [status, setStatus] = useState("");
  const [quick, setQuick] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [query, setQuery] = useState("");

  const results = searchTournaments(db, {
    sportId,
    ageCategory,
    genderCategory,
    status,
    fromDate,
    query,
    cityId: "indore",
  });

  const reset = () => {
    setSportId("");
    setAgeCategory("");
    setGenderCategory("");
    setStatus("");
    setQuick("All");
    setFromDate("");
    setQuery("");
  };

  const quickFilters = [
    ["", "All"],
    ["nearby", "Nearby"],
    ["UPCOMING", "Upcoming"],
    ["LIVE", "Ongoing"],
    ["COMPLETED", "Completed"],
  ] as const;

  return (
    <Page>
      <div className="mb-8 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
          Sports near you
        </p>
        <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.9] sm:text-6xl">
          Find your next game.
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          Browse tournaments, leagues and competitions happening across Indore.
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" /> Indore, Madhya Pradesh
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {quickFilters.map(([value, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setQuick(label);
              setStatus(value === "nearby" ? "" : value);
            }}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${quick === label ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-3 lg:grid-cols-6">
        <Input
          placeholder="Search tournaments…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="lg:col-span-2"
        />
        <select className={SELECT} value={sportId} onChange={(e) => setSportId(e.target.value)}>
          <option value="">Sport</option>
          {db.sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          className={SELECT}
          value={ageCategory}
          onChange={(e) => setAgeCategory(e.target.value)}
        >
          <option value="">Age group</option>
          <option value="U-17">U-17</option>
          <option value="U-19">U-19</option>
          <option value="OPEN">Open</option>
        </select>
        <select
          className={SELECT}
          value={genderCategory}
          onChange={(e) => setGenderCategory(e.target.value)}
        >
          <option value="">Eligibility</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="MIXED">Mixed</option>
        </select>
        <select className={SELECT} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Registration status</option>
          <option value="REGISTRATION_OPEN">Registration open</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="LIVE">Live</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <Button variant="ghost" onClick={reset}>
          Clear filters
        </Button>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="No tournaments found."
          description="Try clearing a filter or check back soon. New tournaments are added every week."
          action={<Button onClick={reset}>Clear filters</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </Page>
  );
}
