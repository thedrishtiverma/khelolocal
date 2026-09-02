import { BadgeCheck, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResultStatus, TournamentStatus, VerificationStatus } from "@/types";

const STATUS_LABEL: Record<TournamentStatus, string> = {
  DRAFT: "Draft",
  UPCOMING: "Upcoming",
  REGISTRATION_OPEN: "Registration open",
  LIVE: "Live",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function StatusBadge({
  status,
  className,
}: {
  status: TournamentStatus;
  className?: string;
}) {
  const tone =
    status === "LIVE"
      ? "bg-live/10 text-live border-live/30"
      : status === "REGISTRATION_OPEN"
        ? "bg-lime/20 text-lime-foreground border-lime/40"
        : status === "COMPLETED"
          ? "bg-muted text-muted-foreground border-border"
          : "bg-primary/5 text-primary border-primary/20";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tone,
        className,
      )}
    >
      <Circle className={cn("size-2 fill-current", status === "LIVE" && "animate-pulse")} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function VerifiedBadge({
  label = "Verified",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-verified/30 bg-verified/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-verified",
        className,
      )}
    >
      <BadgeCheck className="size-3.5" />
      {label}
    </span>
  );
}

export function ResultBadge({ status }: { status: ResultStatus }) {
  const map: Record<ResultStatus, string> = {
    PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    VERIFIED: "border-verified/30 bg-verified/10 text-verified",
    REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
  };
  const label =
    status === "PENDING" ? "Pending verification" : status === "VERIFIED" ? "Verified" : "Rejected";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        map[status],
      )}
    >
      {label}
    </span>
  );
}

export function VerificationChip({ status }: { status: VerificationStatus }) {
  if (status === "VERIFIED") return <VerifiedBadge label="Verified sports identity" />;
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {status === "PENDING" ? "Verification pending" : "Unverified"}
    </span>
  );
}
