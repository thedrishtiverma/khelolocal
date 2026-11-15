import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { NetworkHero } from "@/components/shared/NetworkHero";
import { Input } from "@/components/ui/input";
import { useKhelo } from "@/lib/services/store";
import { isAthletePubliclyDiscoverable } from "@/lib/services/selectors";

export const Route = createFileRoute("/athletes")({
  head: () => ({
    meta: [
      { title: "Athletes | KheloLocal" },
      {
        name: "description",
        content: "Find verified athletes, institutions and sporting records across the network.",
      },
    ],
  }),
  component: AthletesPage,
});

function AthletesPage() {
  const { db } = useKhelo();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("");
  const [position, setPosition] = useState("");
  const [institution, setInstitution] = useState("");
  const [age, setAge] = useState("");
  const [verified, setVerified] = useState(false);
  const results = useMemo(
    () =>
      db.athletes.filter(
        (a) =>
          isAthletePubliclyDiscoverable(a) &&
          (a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.primarySport.toLowerCase().includes(query.toLowerCase()) ||
            a.collegeName?.toLowerCase().includes(query.toLowerCase())) &&
          (!sport || a.primarySport === sport) &&
          (!position || a.positionGroup === position) &&
          (!institution || a.collegeName === institution) &&
          (!age || a.ageCategory === age) &&
          (!verified || a.verificationStatus === "VERIFIED"),
      ),
    [db.athletes, query, sport, position, institution, age, verified],
  );
  const select = "h-10 rounded-md border border-input bg-background px-3 text-sm font-medium";
  const positions = Array.from(new Set(db.athletes.map((a) => a.positionGroup)));
  const institutions = Array.from(
    new Set(db.athletes.map((a) => a.collegeName).filter(Boolean)),
  ) as string[];
  return (
    <div>
      <NetworkHero
        tone="athletes"
        eyebrow="Athlete discovery"
        title={
          <>
            Find local talent. <span className="text-lime">Trust the record.</span>
          </>
        }
        description="Search local athletes by sport, institution, position and verified experience."
        highlights={["Sport", "Experience", "Verified"]}
      />
      <Page className="py-14 sm:py-20">
        <div className="directory-search-panel mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Find a player
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Search names, sports, or institutions
              </p>
            </div>
            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
              {results.length} {results.length === 1 ? "athlete" : "athletes"}
            </span>
          </div>
          <label className="directory-search mt-4">
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try a name, sport, or college"
              aria-label="Search athletes"
              className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear athlete search"
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <select className={select} value={sport} onChange={(e) => setSport(e.target.value)}>
            <option value="">Sport</option>
            {db.sports.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className={select} value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="">Position</option>
            {positions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className={select}
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          >
            <option value="">Institution</option>
            {institutions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className={select} value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="">Age group</option>
            {Array.from(new Set(db.athletes.map((a) => a.ageCategory))).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setVerified((value) => !value)}
            className={`rounded-md border px-3 text-sm font-semibold ${verified ? "border-lime bg-lime/15 text-lime" : "border-input"}`}
          >
            Verified
          </button>
        </div>
        <div className="mt-10">
          {results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a) => (
                <AthleteCard key={a.id} athlete={a} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No athletes found"
              description="Try a different name, sport or institution."
            />
          )}
        </div>
      </Page>
    </div>
  );
}
