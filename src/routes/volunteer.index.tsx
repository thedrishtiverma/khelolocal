import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Check,
  ClipboardList,
  Clock,
  Crosshair,
  Dumbbell,
  MapPin,
  Megaphone,
  Paperclip,
  Pencil,
  Plus,
  Send,
  ShieldAlert,
  Trash2,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState, LoadingBlock } from "@/components/shared/Bits";
import { cn } from "@/lib/utils";
import { useCurrentVolunteer, useKhelo, type SubmissionDraft } from "@/lib/services/store";
import type { FieldSubmission, SubmissionKind, SubmissionStatus } from "@/types";

export const Route = createFileRoute("/volunteer/")({
  head: () => ({
    meta: [
      { title: "Volunteer field desk | KheloLocal" },
      {
        name: "description",
        content:
          "Collect and submit tournaments, grounds, academies and local sports opportunities from your assigned zone of Indore.",
      },
      { property: "og:title", content: "Volunteer field desk | KheloLocal" },
      {
        property: "og:description",
        content: "Add on-ground sports data for your zone of Indore and track verification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VolunteerDashboard,
});

const KINDS: {
  kind: SubmissionKind;
  label: string;
  blurb: string;
  icon: typeof Trophy;
}[] = [
  { kind: "TOURNAMENT", label: "Tournament", blurb: "Local cup, league or one-day meet", icon: Trophy },
  { kind: "VENUE", label: "Sports venue", blurb: "Ground, turf, court or hall", icon: MapPin },
  { kind: "ACADEMY", label: "Academy / club", blurb: "Coaching centre or club", icon: Dumbbell },
  { kind: "OPPORTUNITY", label: "Opportunity", blurb: "Trials, camps, open slots", icon: Megaphone },
  { kind: "ORGANIZER_INFO", label: "Organizer info", blurb: "Who runs it + contact", icon: Building2 },
];

const KIND_LABEL: Record<SubmissionKind, string> = {
  TOURNAMENT: "Tournament",
  VENUE: "Venue",
  ACADEMY: "Academy / club",
  OPPORTUNITY: "Opportunity",
  ORGANIZER_INFO: "Organizer info",
};

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  DRAFT: "border-border bg-secondary text-muted-foreground",
  SUBMITTED: "border-amber-400/40 bg-amber-400/10 text-amber-500",
  VERIFIED: "border-lime/40 bg-lime/10 text-lime",
  REJECTED: "border-destructive/40 bg-destructive/10 text-destructive",
};

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Pending verification",
  VERIFIED: "Verified",
  REJECTED: "Sent back",
};

const emptyDraft = (kind: SubmissionKind): SubmissionDraft => ({
  kind,
  title: "",
  sportId: "",
  locality: "",
  address: "",
  gps: "",
  contactName: "",
  contactPhone: "",
  startDate: "",
  notes: "",
  attachmentName: "",
  attachmentUrl: "",
});

function VolunteerDashboard() {
  const { db, hydrated, currentUser, saveSubmission, submitSubmission, deleteSubmission } =
    useKhelo();
  const volunteer = useCurrentVolunteer();
  const [openKind, setOpenKind] = useState<SubmissionKind | null>(null);
  const [draft, setDraft] = useState<SubmissionDraft>(emptyDraft("TOURNAMENT"));
  const [tab, setTab] = useState<"ALL" | "DRAFT" | "SUBMITTED" | "VERIFIED">("ALL");
  const fileRef = useRef<HTMLInputElement>(null);

  const zone = db.zones.find((z) => z.id === volunteer?.zoneId);

  /** Zone lock: a volunteer never sees or writes records outside their own zone. */
  const mine = useMemo(
    () =>
      db.fieldSubmissions
        .filter((f) => f.volunteerId === volunteer?.id && f.zoneId === volunteer?.zoneId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [db.fieldSubmissions, volunteer],
  );

  const counts = {
    all: mine.length,
    draft: mine.filter((f) => f.status === "DRAFT").length,
    submitted: mine.filter((f) => f.status === "SUBMITTED").length,
    verified: mine.filter((f) => f.status === "VERIFIED").length,
  };

  const visible = mine.filter((f) => (tab === "ALL" ? true : f.status === tab));

  const openForm = (kind: SubmissionKind, record?: FieldSubmission) => {
    setDraft(
      record
        ? {
            id: record.id,
            kind: record.kind,
            title: record.title,
            sportId: record.sportId,
            locality: record.locality,
            address: record.address,
            gps: record.gps,
            contactName: record.contactName,
            contactPhone: record.contactPhone,
            startDate: record.startDate,
            notes: record.notes,
            attachmentName: record.attachmentName,
            attachmentUrl: record.attachmentUrl,
          }
        : emptyDraft(kind),
    );
    setOpenKind(kind);
  };

  const persist = (submit: boolean) => {
    if (!draft.title.trim()) {
      toast.error("Give the record a name first.");
      return;
    }
    const saved = saveSubmission({ ...draft, submit });
    if (!saved) {
      toast.error("Only assigned volunteers can add field data.");
      return;
    }
    toast.success(submit ? "Sent for verification" : "Saved as draft");
    setOpenKind(null);
  };

  const useGps = () => {
    if (!navigator.geolocation) {
      toast.error("Location isn't available on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDraft((d) => ({
          ...d,
          gps: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        }));
        toast.success("Location captured");
      },
      () => toast.error("Couldn't get your location — type it in instead."),
    );
  };

  const attach = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 400_000) {
      setDraft((d) => ({ ...d, attachmentName: file.name, attachmentUrl: "" }));
      toast.success(`${file.name} attached (large file kept by reference)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({
        ...d,
        attachmentName: file.name,
        attachmentUrl: typeof reader.result === "string" ? reader.result : "",
      }));
      toast.success(`${file.name} attached`);
    };
    reader.readAsDataURL(file);
  };

  if (!hydrated) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-10">
          <LoadingBlock label="Loading your zone…" />
        </div>
      </AppShell>
    );
  }

  if (!currentUser || !volunteer) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
          <ShieldAlert className="mx-auto size-8 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-black">Volunteer access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in with a volunteer account to collect sports data for your zone.
          </p>
          <Button asChild className="mt-6 w-full">
            <Link to="/login">Go to log in</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const step = counts.verified ? 4 : counts.submitted ? 3 : counts.all ? 2 : 1;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-5 sm:px-6">
        {/* Zone header */}
        <section className="rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-lime">
            Field desk · Indore
          </p>
          <h1 className="mt-1 font-display text-2xl font-black leading-tight sm:text-3xl">
            {volunteer.name.split(" ")[0]}, your zone is {volunteer.zoneName}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(zone?.localities ?? []).map((l) => (
              <span
                key={l}
                className="rounded-full bg-primary-foreground/10 px-2.5 py-1 text-[11px] font-semibold"
              >
                {l}
              </span>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-primary-foreground/70">
            <MapPin className="size-3.5" />
            Zone locked — you can only add and edit data inside {volunteer.zoneName}.
          </p>
        </section>

        {/* Progress indicator */}
        <ol className="mt-4 grid grid-cols-4 gap-2">
          {["Area assigned", "Data collected", "Submitted", "Verified"].map((label, i) => {
            const done = i + 1 <= step;
            return (
              <li key={label} className="flex flex-col gap-2">
                <span
                  className={cn(
                    "h-1.5 rounded-full",
                    done ? "bg-lime" : "bg-border",
                  )}
                />
                <span
                  className={cn(
                    "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide",
                    done ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3 shrink-0 text-lime" /> : null}
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Counters */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Drafts", value: counts.draft, icon: Pencil },
            { label: "Pending", value: counts.submitted, icon: Clock },
            { label: "Approved", value: counts.verified, icon: BadgeCheck },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-card p-3">
              <c.icon className="size-4 text-muted-foreground" />
              <p className="stat-num mt-1 text-2xl">{c.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Add actions */}
        <h2 className="mt-7 font-display text-lg font-bold">Add field data</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {KINDS.map((k) => (
            <button
              key={k.kind}
              onClick={() => openForm(k.kind)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:border-lime active:scale-[0.99]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <k.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{k.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{k.blurb}</span>
              </span>
              <Plus className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* My records */}
        <div className="mt-8 flex items-center gap-2">
          <ClipboardList className="size-4" />
          <h2 className="font-display text-lg font-bold">My submitted records</h2>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {(
            [
              ["ALL", `All ${counts.all}`],
              ["DRAFT", `Drafts ${counts.draft}`],
              ["SUBMITTED", `Pending ${counts.submitted}`],
              ["VERIFIED", `Approved ${counts.verified}`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold",
                tab === key
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {visible.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              description="Pick a card above and log what you see on the ground."
            />
          ) : (
            visible.map((rec) => (
              <article key={rec.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {KIND_LABEL[rec.kind]}
                    </p>
                    <h3 className="truncate font-display text-base font-bold">{rec.title}</h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {[rec.locality, rec.zoneName].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                      STATUS_STYLE[rec.status],
                    )}
                  >
                    {STATUS_LABEL[rec.status]}
                  </span>
                </div>

                {rec.notes ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{rec.notes}</p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  {rec.gps ? (
                    <span className="flex items-center gap-1">
                      <Crosshair className="size-3" />
                      {rec.gps}
                    </span>
                  ) : null}
                  {rec.attachmentName ? (
                    <span className="flex items-center gap-1">
                      <Paperclip className="size-3" />
                      {rec.attachmentName}
                    </span>
                  ) : null}
                  {rec.verifiedBy ? (
                    <span className="flex items-center gap-1 text-lime">
                      <BadgeCheck className="size-3" />
                      {rec.verifiedBy}
                    </span>
                  ) : null}
                </div>

                {rec.status !== "VERIFIED" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openForm(rec.kind, rec)}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    {rec.status !== "SUBMITTED" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          submitSubmission(rec.id);
                          toast.success("Sent for verification");
                        }}
                      >
                        <Send className="size-3.5" />
                        Submit
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        deleteSubmission(rec.id);
                        toast.success("Record removed");
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>

      {/* Add / edit form */}
      <Dialog open={openKind !== null} onOpenChange={(o) => !o && setOpenKind(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {draft.id ? "Edit" : "Add"} {openKind ? KIND_LABEL[openKind].toLowerCase() : ""}
            </DialogTitle>
            <DialogDescription>
              Collected for {volunteer.zoneName}, Indore. Your zone can't be changed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fs-title">Name</Label>
              <Input
                id="fs-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="e.g. Scheme 54 Monsoon Kabaddi Cup"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fs-sport">Sport</Label>
                <select
                  id="fs-sport"
                  aria-label="Sport"
                  value={draft.sportId}
                  onChange={(e) => setDraft((d) => ({ ...d, sportId: e.target.value }))}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select sport</option>
                  {db.sports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fs-locality">Locality</Label>
                <select
                  id="fs-locality"
                  aria-label="Locality"
                  value={draft.locality}
                  onChange={(e) => setDraft((d) => ({ ...d, locality: e.target.value }))}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select locality</option>
                  {(zone?.localities ?? []).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fs-address">Address / landmark</Label>
              <Input
                id="fs-address"
                value={draft.address}
                onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                placeholder="Behind Nipania bus stop"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fs-gps">GPS location</Label>
              <div className="flex gap-2">
                <Input
                  id="fs-gps"
                  value={draft.gps}
                  onChange={(e) => setDraft((d) => ({ ...d, gps: e.target.value }))}
                  placeholder="22.75331, 75.89370"
                />
                <Button type="button" variant="outline" onClick={useGps}>
                  <Crosshair className="size-4" />
                  Pin
                </Button>
              </div>
            </div>

            {openKind === "TOURNAMENT" || openKind === "OPPORTUNITY" ? (
              <div className="space-y-1.5">
                <Label htmlFor="fs-date">Start date</Label>
                <Input
                  id="fs-date"
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
                />
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fs-contact">Organizer / contact person</Label>
                <Input
                  id="fs-contact"
                  value={draft.contactName}
                  onChange={(e) => setDraft((d) => ({ ...d, contactName: e.target.value }))}
                  placeholder="Vijay Nagar Sports Samiti"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fs-phone">Contact number</Label>
                <Input
                  id="fs-phone"
                  value={draft.contactPhone}
                  onChange={(e) => setDraft((d) => ({ ...d, contactPhone: e.target.value }))}
                  placeholder="+91 90000 00000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fs-notes">Notes</Label>
              <Textarea
                id="fs-notes"
                rows={3}
                value={draft.notes}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                placeholder="Timings, fees, facilities, what they need help with…"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Supporting photo / document</Label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => attach(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileRef.current?.click()}
              >
                <Paperclip className="size-4" />
                {draft.attachmentName || "Upload photo or document"}
              </Button>
              {draft.attachmentUrl.startsWith("data:image") ? (
                <img
                  src={draft.attachmentUrl}
                  alt={`Attachment for ${draft.title || "record"}`}
                  className="mt-2 h-32 w-full rounded-md object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="sm:flex-1" onClick={() => persist(false)}>
              Save draft
            </Button>
            <Button className="sm:flex-1" onClick={() => persist(true)}>
              <Send className="size-4" />
              Submit for verification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
