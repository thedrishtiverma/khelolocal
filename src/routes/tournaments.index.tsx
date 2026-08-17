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

const SELECT =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium";

function ExploreTournaments() {
  const { db } = useKhelo();
  const [sportId, setSportId] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [genderCategory, setGenderCategory] = useState("");
  const [status, setStatus] = useState("");
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
    setFromDate("");
    setQuery("");
  };

  return (
    <Page>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black sm:text-4xl">Sports near you</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4" /> Indore, Madhya Pradesh
        </p>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-3 lg:grid-cols-6">
        <Input
          placeholder="Search tournaments…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="lg:col-span-2"
        />
        <select className={SELECT} value={sportId} onChange={(e) => setSportId(e.target.value)}>
          <option value="">All sports</option>
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
          <option value="">Any age category</option>
          <option value="U-17">U-17</option>
          <option value="U-19">U-19</option>
          <option value="OPEN">Open</option>
        </select>
        <select
          className={SELECT}
          value={genderCategory}
          onChange={(e) => setGenderCategory(e.target.value)}
        >
          <option value="">Any gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="MIXED">Mixed</option>
        </select>
        <select className={SELECT} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
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
          title="No tournaments found in Indore."
          description="Try clearing a filter or check back soon — new tournaments are added weekly."
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