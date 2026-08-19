import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Database as DbIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { StatusBadge, VerificationChip } from "@/components/shared/Badges";
import { RecordCard } from "@/components/college/RecordCard";
import { useKhelo } from "@/lib/services/store";
import { pendingAdminRecords } from "@/lib/services/selectors";
import { formatDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin console — data manager & verifier | KheloLocal" },
      {
        name: "description",
        content:
          "Platform admin console: verify college sports records, athlete identities and tournament listings across Indore.",
      },
      { property: "og:title", content: "Admin console | KheloLocal" },
      {
        property: "og:description",
        content: "Single place to verify athlete records and tournament data.",
      },
    ],
  }),
  component: AdminConsole,
});

type Tab = "records" | "tournaments" | "athletes";

function AdminConsole() {
  const {
    db,
    hydrated,
    currentUser,
    adminReviewRecord,
    adminSetTournamentVerified,
    adminSetAthleteVerification,
  } = useKhelo();
  const [tab, setTab] = useState<Tab>("records");
  const [query, setQuery] = useState("");

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <Page>
        <EmptyState
          title={hydrated ? "Admins only" : "Loading…"}
          description="Log in with the admin demo account to manage and verify platform data."
          action={
            <Button asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          }
        />
      </Page>
    );
  }

  const queue = pendingAdminRecords(db);
  const verifiedRecords = db.collegeRecords.filter((r) => r.status === "ADMIN_VERIFIED");
  const unverifiedTournaments = db.tournaments.filter((t) => !t.adminVerified);
  const q = query.toLowerCase().trim();

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "records", label: "Record verification", count: queue.length },
    { id: "tournaments", label: "Tournament data", count: unverifiedTournaments.length },
    { id: "athletes", label: "Athlete identities", count: db.athletes.length },
  ];

  return (
    <Page>
      <section className="surface-panel rounded-xl p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-surface-foreground/60">
          Admin console
        </p>
        <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">
          Database manager & verifier
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-surface-foreground/70">
          The single source of truth: nothing becomes a public verified record until it clears this
          desk.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
          <Stat tone="accent" value={queue.length} label="Records to verify" />
          <Stat tone="invert" value={verifiedRecords.length} label="Verified records" />
          <Stat tone="invert" value={unverifiedTournaments.length} label="Tournaments to check" />
          <Stat tone="invert" value={db.athletes.length} label="Athletes in DB" />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              tab === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === "records" ? (
        <div className="mt-8">
          <SectionHeading
            eyebrow="College-verified, awaiting platform verification"
            title="Record verification queue"
            subtitle="Approving publishes the record on the athlete's public profile and counts towards their verified achievements."
          />
          {queue.length === 0 ? (
            <EmptyState
              title="Queue is clear."
              description="Every college-confirmed record has been verified."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {queue.map((r) => (
                <RecordCard
                  key={r.id}
                  record={r}
                  showAthlete
                  actions={
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          adminReviewRecord(r.id, true);
                          toast.success("Record verified", {
                            description: `${r.athleteName}'s profile has been updated.`,
                          });
                        }}
                      >
                        <BadgeCheck className="size-4" />
                        Verify & publish
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          adminReviewRecord(r.id, false);
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

          <div className="mt-12">
            <SectionHeading title={`Verified record book (${verifiedRecords.length})`} />
            <div className="grid gap-4 lg:grid-cols-2">
              {verifiedRecords.map((r) => (
                <RecordCard key={r.id} record={r} showAthlete />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "tournaments" ? (
        <div className="mt-8">
          <SectionHeading
            eyebrow="Data integrity"
            title="Tournament listings"
            subtitle="Verify that live Indore tournaments are genuine before they collect registrations."
            action={
              <Button asChild variant="outline">
                <Link to="/organizer/create">Add a tournament</Link>
              </Button>
            }
          />
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tournament</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {db.tournaments.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Link
                        to="/tournaments/$id"
                        params={{ id: t.id }}
                        className="font-semibold hover:underline"
                      >
                        {t.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {t.sportName} · {t.organizerName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateRange(t.startDate, t.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wider",
                          t.adminVerified ? "text-verified" : "text-muted-foreground",
                        )}
                      >
                        {t.adminVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant={t.adminVerified ? "outline" : "default"}
                        onClick={() => {
                          adminSetTournamentVerified(t.id, !t.adminVerified);
                          toast.success(
                            t.adminVerified ? "Marked unverified" : "Tournament data verified",
                          );
                        }}
                      >
                        <ShieldCheck className="size-4" />
                        {t.adminVerified ? "Unverify" : "Verify"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {tab === "athletes" ? (
        <div className="mt-8">
          <SectionHeading
            eyebrow="Database"
            title="Athlete identities"
            subtitle="Toggle identity verification and jump into any profile to audit its record trail."
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search athletes by name"
            className="mb-4 max-w-sm"
          />
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Athlete</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Verified records</th>
                  <th className="px-4 py-3">Identity</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {db.athletes
                  .filter((a) => (q ? a.name.toLowerCase().includes(q) : true))
                  .map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <Link
                          to="/athletes/$id"
                          params={{ id: a.id }}
                          className="font-semibold hover:underline"
                        >
                          {a.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {a.primarySport} · {a.position || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.collegeName ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="stat-num">
                          {
                            db.collegeRecords.filter(
                              (r) => r.athleteId === a.id && r.status === "ADMIN_VERIFIED",
                            ).length
                          }
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <VerificationChip status={a.verificationStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            adminSetAthleteVerification(
                              a.id,
                              a.verificationStatus === "VERIFIED" ? "PENDING" : "VERIFIED",
                            )
                          }
                        >
                          <DbIcon className="size-4" />
                          {a.verificationStatus === "VERIFIED" ? "Set pending" : "Verify identity"}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </Page>
  );
}