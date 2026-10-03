import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Page, SectionHeading, Stat } from "@/components/shared/Bits";
import { StatusBadge, VerificationChip } from "@/components/shared/Badges";
import { RecordCard } from "@/components/college/RecordCard";
import { useKhelo } from "@/lib/services/store";
import { effectiveTournamentStatus, pendingAdminRecords } from "@/lib/services/selectors";
import { formatDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";

const ADMIN_EMAILS = new Set(["admin@khelolocal.demo"]);
type Tab = "overview" | "approvals" | "organizations" | "athletes" | "operations";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin operations | KheloLocal" }] }),
  component: AdminConsole,
});

function AdminConsole() {
  const {
    db,
    hydrated,
    currentUser,
    adminReviewRecord,
    adminSetTournamentVerified,
    adminSetAthleteVerification,
    reviewSubmission,
  } = useKhelo();
  const [tab, setTab] = useState<Tab>("overview");
  const [cityId, setCityId] = useState("all");
  const authorised =
    currentUser?.role === "ADMIN" && ADMIN_EMAILS.has(currentUser.email.toLowerCase());

  if (!authorised)
    return (
      <Page>
        <EmptyState
          title={hydrated ? "Private admin area" : "Loading…"}
          description="This control room is available only to an authorised KheloLocal admin email."
          action={
            <Button asChild>
              <Link to="/login">Admin login</Link>
            </Button>
          }
        />
      </Page>
    );

  const inCity = <T extends { cityId: string }>(item: T) =>
    cityId === "all" || item.cityId === cityId;
  const city = db.cities.find((item) => item.id === cityId);
  const athletes = db.athletes.filter(inCity);
  const tournaments = db.tournaments.filter(inCity);
  const organizations = db.organizers.filter(inCity);
  const volunteers = db.volunteers.filter(inCity);
  const reports = db.fieldSubmissions.filter(inCity);
  const records = pendingAdminRecords(db).filter(
    (record) =>
      cityId === "all" ||
      db.athletes.find((athlete) => athlete.id === record.athleteId)?.cityId === cityId,
  );
  const unverifiedTournaments = tournaments.filter((item) => !item.adminVerified);
  const newOrganizations = organizations.filter((item) => item.verificationStatus !== "VERIFIED");
  const pendingReports = reports.filter((item) => item.status === "SUBMITTED");
  const alerts = [
    [records.length, "athlete records awaiting approval", "text-orange-500"],
    [newOrganizations.length, "new organizations to review", "text-blue-600"],
    [unverifiedTournaments.length, "tournament listings to check", "text-orange-500"],
    [pendingReports.length, "field reports awaiting moderation", "text-blue-600"],
  ].filter(([count]) => count) as [number, string, string][];
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    {
      id: "approvals",
      label: "Admin approvals",
      count: records.length + unverifiedTournaments.length,
    },
    { id: "organizations", label: "New organizations", count: newOrganizations.length },
    { id: "athletes", label: "Athletes", count: athletes.length },
    { id: "operations", label: "City operations", count: pendingReports.length },
  ];

  return (
    <Page className="py-6 sm:py-10">
      <section className="rounded-2xl border border-primary/15 bg-gradient-to-br from-blue-50 via-background to-orange-50 p-6 sm:p-9 dark:from-primary/15 dark:via-background dark:to-accent/10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              KheloLocal / private operations
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.9] sm:text-6xl">
              <span className="text-blue-600">City</span>{" "}
              <span className="text-orange-500">operations</span>
              <br />
              control room.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage the trusted local-sport network city by city: review data, support local teams
              and surface issues before they reach athletes.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/80 px-4 py-3 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-1 text-sm font-bold">{currentUser.email}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/70 pt-5">
          <label
            htmlFor="admin-city"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Operating city
          </label>
          <select
            id="admin-city"
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold"
          >
            <option value="all">All operating cities</option>
            {db.cities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}, {item.state}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">
            {city ? `${city.name} in view` : `${db.cities.length} operating cities in view`}
          </span>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Stat value={tournaments.length} label="Tournaments" />
          <Stat value={athletes.length} label="Athletes" />
          <Stat value={organizations.length} label="Organizations" />
          <Stat tone="accent" value={records.length + pendingReports.length} label="Needs action" />
        </div>
      </section>
      <div className="mt-7 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-bold transition-colors",
              tab === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            {item.count ? ` · ${item.count}` : ""}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-border bg-card p-6">
            <SectionHeading
              eyebrow="Today’s work"
              title="To-do list"
              subtitle={`Priorities for ${city?.name ?? "all operating cities"}.`}
            />
            <div className="space-y-3">
              {[
                ["Approve athlete records", records.length, "approvals"],
                ["Review new organizations", newOrganizations.length, "organizations"],
                ["Check tournament listings", unverifiedTournaments.length, "approvals"],
                ["Moderate field reports", pendingReports.length, "operations"],
              ].map(([label, count, target]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTab(target as Tab)}
                  className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left hover:border-primary"
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <ClipboardCheck className="size-5 text-blue-600" />
                    {label}
                  </span>
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-orange-500" />
              <h2 className="font-display text-2xl font-black uppercase">Notifications</h2>
            </div>
            <div className="mt-5 space-y-4">
              {alerts.length ? (
                alerts.map(([count, label, tone]) => (
                  <div key={label} className="border-l-2 border-border pl-4">
                    <p className={cn("font-num text-2xl font-bold", tone)}>{count}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No operational alerts. Your queues are clear.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "approvals" ? (
        <section className="mt-9 space-y-10">
          <SectionHeading
            eyebrow="Trust & safety"
            title="Admin approvals"
            subtitle="Approve verified sporting data before it becomes a trusted public signal."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {records.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                showAthlete
                actions={
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        adminReviewRecord(record.id, true);
                        toast.success("Record verified and published");
                      }}
                    >
                      <BadgeCheck className="size-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        adminReviewRecord(record.id, false);
                        toast("Record returned");
                      }}
                    >
                      Return
                    </Button>
                  </>
                }
              />
            ))}
          </div>
          {!records.length ? (
            <p className="text-sm text-muted-foreground">
              No athlete records need approval in this view.
            </p>
          ) : null}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-[700px] w-full text-left text-sm">
              <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tournament</th>
                  <th className="px-4 py-3">City / dates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament) => (
                  <tr key={tournament.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">
                      {tournament.name}
                      <p className="text-xs font-normal text-muted-foreground">
                        {tournament.organizerName} · {tournament.sportName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {tournament.cityName}
                      <br />
                      {formatDateRange(tournament.startDate, tournament.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={effectiveTournamentStatus(tournament)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant={tournament.adminVerified ? "outline" : "default"}
                        onClick={() => {
                          adminSetTournamentVerified(tournament.id, !tournament.adminVerified);
                          toast.success(
                            tournament.adminVerified
                              ? "Tournament marked unverified"
                              : "Tournament approved",
                          );
                        }}
                      >
                        <ShieldCheck className="size-4" />
                        {tournament.adminVerified ? "Unverify" : "Approve"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "organizations" ? (
        <section className="mt-9">
          <SectionHeading
            eyebrow="Partner network"
            title="New organizations"
            subtitle="Review the organizers and institutions growing the local sports network."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((organization) => (
              <article
                key={organization.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <Building2 className="size-5 text-blue-600" />
                <h2 className="mt-5 font-display text-xl font-bold uppercase">
                  {organization.organizationName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {organization.organizationType} · {organization.cityName}
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {organization.description}
                </p>
                <div className="mt-5">
                  <VerificationChip status={organization.verificationStatus} />
                </div>
              </article>
            ))}
          </div>
          {!organizations.length ? <EmptyState title="No organizations in this city yet." /> : null}
        </section>
      ) : null}

      {tab === "athletes" ? (
        <section className="mt-9">
          <SectionHeading
            eyebrow="City athlete directory"
            title="Athletes across the city"
            subtitle="Audit identity status and keep discovery trustworthy."
          />
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Athlete</th>
                  <th className="px-4 py-3">City / sport</th>
                  <th className="px-4 py-3">Identity</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete) => (
                  <tr key={athlete.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold">
                      {athlete.name}
                      <p className="text-xs font-normal text-muted-foreground">
                        {athlete.collegeName ?? "Independent athlete"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {athlete.cityName} · {athlete.primarySport}
                    </td>
                    <td className="px-4 py-3">
                      <VerificationChip status={athlete.verificationStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          adminSetAthleteVerification(
                            athlete.id,
                            athlete.verificationStatus === "VERIFIED" ? "PENDING" : "VERIFIED",
                          )
                        }
                      >
                        {athlete.verificationStatus === "VERIFIED"
                          ? "Set pending"
                          : "Verify identity"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "operations" ? (
        <section className="mt-9">
          <SectionHeading
            eyebrow="On-the-ground coverage"
            title="City operations"
            subtitle="Review local coverage, field reports and operational readiness from one place."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {db.cities
              .filter((item) => cityId === "all" || item.id === cityId)
              .map((item) => (
                <article key={item.id} className="rounded-xl border border-border bg-card p-5">
                  <MapPin className="size-5 text-orange-500" />
                  <h2 className="mt-5 font-display text-2xl font-black uppercase">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.state}</p>
                  <div className="mt-5 border-t border-border pt-4 text-sm">
                    <p>
                      {volunteers.filter((volunteer) => volunteer.cityId === item.id).length} field
                      volunteers
                    </p>
                    <p className="mt-1">
                      {pendingReports.filter((report) => report.cityId === item.id).length} reports
                      awaiting review
                    </p>
                  </div>
                </article>
              ))}
          </div>
          <div className="mt-8 space-y-3">
            {pendingReports.map((report) => (
              <article
                key={report.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {report.cityName} · {report.kind}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold">{report.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {report.address || report.notes}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      reviewSubmission(report.id, true);
                      toast.success("Field report approved");
                    }}
                  >
                    <CheckCircle2 className="size-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reviewSubmission(report.id, false, "Needs more detail")}
                  >
                    Return
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {!pendingReports.length ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No field reports await review in this city view.
            </p>
          ) : null}
        </section>
      ) : null}
    </Page>
  );
}
