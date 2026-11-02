import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState, Page } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { useKhelo } from "@/lib/services/store";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { searchTournaments } from "@/lib/services/selectors";
import { searchTournamentPage } from "@/lib/services/tournament-backend";
import type { Tournament } from "@/types";

export const Route = createFileRoute("/tournaments/")({
  head: () => ({
    meta: [
      { title: "Sports near you — Tournaments | KheloLocal" },
      {
        name: "description",
        content:
          "Browse football and kabaddi tournaments. Filter by sport, age category, gender and status.",
      },
      { property: "og:title", content: "Sports near you — Tournaments" },
      {
        property: "og:description",
        content: "Find football and kabaddi tournaments open for registration.",
      },
    ],
  }),
  component: ExploreTournaments,
});

const SELECT = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium";

function ExploreTournaments() {
  const { db } = useKhelo();
  const [sportId, setSportId] = useState("");
  const [cityName, setCityName] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [genderCategory, setGenderCategory] = useState("");
  const [status, setStatus] = useState("");
  const [quick, setQuick] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<Tournament[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);
  const selectedCityId = db.cities.find(
    (city) => city.name.toLowerCase() === cityName.toLowerCase(),
  )?.id;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const demoResults = searchTournaments(db, {
        sportId,
        ...(selectedCityId ? { cityId: selectedCityId } : {}),
        ageCategory,
        genderCategory,
        status,
        fromDate,
        query,
      });
      setResults(demoResults);
      setTotal(demoResults.length);
      setLoading(false);
      setLoadError("");
      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");
    void searchTournamentPage({
      sportId,
      cityName,
      ageCategory,
      genderCategory,
      status,
      fromDate,
      query,
      page,
    })
      .then((result) => {
        if (!active) return;
        setResults(result.tournaments);
        setTotal(result.total);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setResults([]);
        setTotal(0);
        setLoadError(error instanceof Error ? error.message : "Could not load tournaments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    db,
    sportId,
    cityName,
    selectedCityId,
    ageCategory,
    genderCategory,
    status,
    fromDate,
    query,
    page,
    retry,
  ]);

  const reset = () => {
    setSportId("");
    setCityName("");
    setAgeCategory("");
    setGenderCategory("");
    setStatus("");
    setQuick("All");
    setFromDate("");
    setQuery("");
    setPage(0);
  };

  const quickFilters = [
    ["", "All"],
    ["Indore", "Indore"],
    ["UPCOMING", "Upcoming"],
    ["LIVE", "Ongoing"],
    ["COMPLETED", "Completed"],
  ] as const;

  return (
    <div>
      <NetworkHero
        tone="tournaments"
        eyebrow="Fixtures across your city"
        title={
          <>
            Find your next game. <span className="text-lime">Make it count.</span>
          </>
        }
        description="From first fixtures to finals, find the competitions that turn an ordinary weekend into game day."
        highlights={["Fixtures", "Entry open", "Game day"]}
        actions={
          <Button asChild size="lg">
            <Link to="/tournaments/create">Create a tournament</Link>
          </Button>
        }
      />
      <Page className="py-10 sm:py-14">
        <div className="mb-5 flex flex-wrap gap-2">
          {quickFilters.map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setQuick(label);
                setCityName(value === "Indore" ? "Indore" : "");
                setStatus(value === "Indore" ? "" : value);
                setPage(0);
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
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="lg:col-span-2"
          />
          <Input
            list="tournament-cities"
            placeholder="City"
            value={cityName}
            onChange={(event) => {
              setCityName(event.target.value);
              setQuick("All");
              setPage(0);
            }}
          />
          <datalist id="tournament-cities">
            {db.cities.map((city) => (
              <option key={city.id} value={city.name} />
            ))}
          </datalist>
          <select
            className={SELECT}
            value={sportId}
            onChange={(e) => {
              setSportId(e.target.value);
              setPage(0);
            }}
          >
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
            onChange={(e) => {
              setAgeCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Age group</option>
            <option value="U-17">U-17</option>
            <option value="U-19">U-19</option>
            <option value="OPEN">Open</option>
          </select>
          <select
            className={SELECT}
            value={genderCategory}
            onChange={(e) => {
              setGenderCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Eligibility</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="MIXED">Mixed</option>
          </select>
          <select
            className={SELECT}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setQuick("All");
              setPage(0);
            }}
          >
            <option value="">Registration status</option>
            <option value="REGISTRATION_OPEN">Registration open</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="LIVE">Live</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(0);
            }}
          />
          <Button variant="ghost" onClick={reset}>
            Clear filters
          </Button>
        </div>

        {loadError ? (
          <EmptyState
            title="Tournaments could not be loaded."
            description={loadError}
            action={<Button onClick={() => setRetry(retry + 1)}>Try again</Button>}
          />
        ) : loading ? (
          <p className="py-12 text-center text-sm text-muted-foreground" role="status">
            Loading tournaments…
          </p>
        ) : results.length === 0 ? (
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
        {isSupabaseConfigured() && total > 12 ? (
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {page * 12 + 1}–{Math.min((page + 1) * 12, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 0 || loading}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={(page + 1) * 12 >= total || loading}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </Page>
    </div>
  );
}
