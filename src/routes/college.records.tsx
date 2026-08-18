import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, Page, SectionHeading } from "@/components/shared/Bits";
import { RecordCard } from "@/components/college/RecordCard";
import { useCurrentCollege, useKhelo } from "@/lib/services/store";
import { athletesOfCollege, recordsOfCollege } from "@/lib/services/selectors";
import { LEVEL_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SelectionLevel } from "@/types";

export const Route = createFileRoute("/college/records")({
  head: () => ({
    meta: [
      { title: "College record book | KheloLocal" },
      {
        name: "description",
        content:
          "Add and manage annual sports event records for student athletes — college level through nodal, state and national selection.",
      },
      { property: "og:title", content: "College record book | KheloLocal" },
      {
        property: "og:description",
        content: "Log annual sports results and push them into verified athlete profiles.",
      },
    ],
  }),
  component: CollegeRecordsPage,
});

const LEVELS: SelectionLevel[] = ["COLLEGE", "NODAL", "STATE", "NATIONAL"];

function CollegeRecordsPage() {
  const { db, hydrated, submitCollegeRecord, collegeReviewRecord } = useKhelo();
  const college = useCurrentCollege();
  const [athleteId, setAthleteId] = useState("");
  const [sportId, setSportId] = useState("kabaddi");
  const [eventName, setEventName] = useState("VARCHASVA — Annual Sports Event 2025");
  const [season, setSeason] = useState("2024-25");
  const [level, setLevel] = useState<SelectionLevel>("COLLEGE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [representedFor, setRepresentedFor] = useState("SGSITS Indore");

  const athletes = useMemo(
    () => (college ? athletesOfCollege(db, college.id) : []),
    [college, db],
  );
  const records = useMemo(
    () => (college ? recordsOfCollege(db, college.id) : []),
    [college, db],
  );

  if (!college) {
    return (
      <Page>
        <EmptyState
          title={hydrated ? "Log in as a college" : "Loading…"}
          description="The record book is available to college accounts."
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  return (
    <Page>
      <SectionHeading
        eyebrow={college.shortName}
        title="Record book"
        subtitle="Every past performance from your annual sports event, plus the nodal → state → national selection trail."
      />

      <form
        className="rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const created = submitCollegeRecord({
            athleteId,
            sportId,
            eventName,
            season,
            level,
            title,
            description,
            representedFor,
            autoCollegeVerify: true,
          });
          if (!created) {
            toast.error("Pick a student athlete first");
            return;
          }
          toast.success("Record added", {
            description: "College-verified. It now needs admin verification to go public.",
          });
          setTitle("");
          setDescription("");
        }}
      >
        <h2 className="font-display text-lg font-bold">Add a past record</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="athlete">Student athlete</Label>
            <select
              id="athlete"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              required
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select athlete</option>
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sport">Sport</Label>
            <select
              id="sport"
              value={sportId}
              onChange={(e) => setSportId(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {db.sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Input id="event" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="season">Season</Label>
            <Input id="season" value={season} onChange={(e) => setSeason(e.target.value)} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Selection level</Label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    level === l
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {LEVEL_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Result / award</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Best Raider 2025"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repFor">Represented for</Label>
            <Input
              id="repFor"
              value={representedFor}
              onChange={(e) => setRepresentedFor(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="desc">Details</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened, scores, opponents, squad details…"
              rows={3}
            />
          </div>
        </div>
        <Button type="submit" className="mt-5">
          Add college-verified record
        </Button>
      </form>

      <div className="mt-12">
        <SectionHeading title={`All records (${records.length})`} />
        {records.length === 0 ? (
          <EmptyState title="No records on file yet." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {records.map((r) => (
              <RecordCard
                key={r.id}
                record={r}
                showAthlete
                actions={
                  r.status === "SUBMITTED" ? (
                    <>
                      <Button size="sm" onClick={() => collegeReviewRecord(r.id, true)}>
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => collegeReviewRecord(r.id, false)}
                      >
                        Reject
                      </Button>
                    </>
                  ) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}