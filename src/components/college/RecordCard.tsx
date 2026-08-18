import type { ReactNode } from "react";
import { BadgeCheck, Clock, ShieldCheck, XCircle } from "lucide-react";
import { LEVEL_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CollegeRecord, RecordStatus } from "@/types";

const STATUS_META: Record<RecordStatus, { label: string; tone: string; icon: ReactNode }> = {
  SUBMITTED: {
    label: "Awaiting college check",
    tone: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    icon: <Clock className="size-3.5" />,
  },
  COLLEGE_VERIFIED: {
    label: "College verified · awaiting admin",
    tone: "border-primary/25 bg-primary/5 text-primary",
    icon: <ShieldCheck className="size-3.5" />,
  },
  ADMIN_VERIFIED: {
    label: "Verified record",
    tone: "border-verified/30 bg-verified/10 text-verified",
    icon: <BadgeCheck className="size-3.5" />,
  },
  REJECTED: {
    label: "Rejected",
    tone: "border-destructive/30 bg-destructive/10 text-destructive",
    icon: <XCircle className="size-3.5" />,
  },
};

export function RecordStatusChip({ status }: { status: RecordStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        meta.tone,
      )}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

export function RecordCard({
  record,
  actions,
  showAthlete = false,
}: {
  record: CollegeRecord;
  actions?: ReactNode;
  showAthlete?: boolean;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {showAthlete ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {record.athleteName} · {record.sportName}
            </p>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {record.sportName}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg font-bold leading-tight">{record.title}</h3>
          <p className="text-sm text-muted-foreground">
            {record.eventName} · {record.season}
          </p>
        </div>
        <RecordStatusChip status={record.status} />
      </div>

      <p className="mt-3 text-sm leading-relaxed">{record.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-foreground">
          {LEVEL_LABELS[record.level] ?? record.level}
        </span>
        <span>Represented: {record.representedFor}</span>
        {record.collegeVerifiedBy ? <span>· College: {record.collegeVerifiedBy}</span> : null}
        {record.adminVerifiedBy ? <span>· Admin: {record.adminVerifiedBy}</span> : null}
      </div>

      {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
    </article>
  );
}
