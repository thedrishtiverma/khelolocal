import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { RecordCard } from "@/components/college/RecordCard";
import { AthleteCard } from "@/components/athlete/AthleteCard";
import { useCurrentCollege, useKhelo } from "@/lib/services/store";
import {
  athletesOfCollege,
  pendingCollegeRecords,
  recordsOfCollege,
} from "@/lib/services/selectors";

export const Route = createFileRoute("/college/")({
  head: () => ({
    meta: [
      { title: "College sports desk | KheloLocal" },
      {
        name: "description",
        content:
          "Colleges verify annual sports event records, track student athletes through the selection ladder and discover talent on campus.",
      },
      { property: "og:title", content: "College sports desk | KheloLocal" },
      {
        property: "og:description",
        content: "Verify annual sports records and discover student athletes.",
      },
    ],
  }),
  component: CollegeDashboard,
});

function CollegeDashboard() {
  const { db, hydrated, collegeReviewRecord } = useKhelo();
  const college = useCurrentCollege();

  if (!college) {
    return (
      <Page>
        <EmptyState
          title={hydrated ? "Log in as a college" : "Loading…"}
          description="Use the SGSITS Sports Cell demo account to open the college desk."
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const athletes = athletesOfCollege(db, college.id);
  const records = recordsOfCollege(db, college.id);
  const pending = pendingCollegeRecords(db, college.id);
  const verified = records.filter((r) => r.status === "ADMIN_VERIFIED");
  const awaitingAdmin = records.filter((r) => r.status === "COLLEGE_VERIFIED");

  return (
    <Page>
      <section className="surface-panel rounded-xl p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-surface-foreground/60">
          College sports desk
        </p>
        <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">{college.shortName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-surface-foreground/70">
          {college.sportsEventName} · {college.cityName}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
          <Stat tone="invert" value={athletes.length} label="Student athletes" />
          <Stat tone="invert" value={records.length} label="Records on file" />
          <Stat tone="accent" value={verified.length} label="Fully verified" />
          <Stat tone="invert" value={pending.length} label="Awaiting your check" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/college/records">Manage records</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/discover">Discover athletes</Link>
          </Button>
        </div>
      </section>

      <div className="mt-12">
        <SectionHeading
          eyebrow="Verification queue"
          title="Records awaiting college confirmation"
          subtitle="Confirm against your event result sheet. Confirmed records then go to the KheloLocal admin for final verification."
        />
        {pending.length === 0 ? (
          <EmptyState
            title="Nothing waiting on you."
            description="Every submitted record has been reviewed."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pending.map((r) => (
              <RecordCard
                key={r.id}
                record={r}
                showAthlete
                actions={
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        collegeReviewRecord(r.id, true);
                        toast.success("Record confirmed", {
                          description: "Sent to the KheloLocal admin for final verification.",
                        });
                      }}
                    >
                      Confirm record
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        collegeReviewRecord(r.id, false);
                        toast("Record rejected");
                      }}
                    >
                      Reject
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      {awaitingAdmin.length ? (
        <div className="mt-12">
          <SectionHeading
            title="With the admin"
            subtitle="Confirmed by your college, waiting on platform verification."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {awaitingAdmin.map((r) => (
              <RecordCard key={r.id} record={r} showAthlete />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-12">
        <SectionHeading
          title="Your student athletes"
          subtitle="Profiles carrying your college's verified sporting record."
        />
        {athletes.length === 0 ? (
          <EmptyState title="No student athletes linked yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {athletes.map((a) => (
              <AthleteCard key={a.id} athlete={a} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
