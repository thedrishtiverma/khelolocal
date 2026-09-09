import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { Input } from "@/components/ui/input";
import { useKhelo } from "@/lib/services/store";

export const Route = createFileRoute("/athletes")({
  head: () => ({
    meta: [
      { title: "Athletes in Indore | KheloLocal" },
      {
        name: "description",
        content: "Find verified athletes, institutions and sporting records around Indore.",
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
    <Page className="py-14 sm:py-24">
      <SectionHeading
        eyebrow="Athlete discovery"
        title="Find the players around you."
        subtitle="Search local athletes by sport, institution, position and verified experience."
      />
      <div className="relative mt-10 max-w-2xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search athletes, sports, institutions..."
          className="h-12 pl-10"
        />
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
        <select className={select}>
          <option>City · Indore</option>
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
  );
}
