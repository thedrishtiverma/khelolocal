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

export function StatusBadge({ status, className }: { status: TournamentStatus; className?: string }) {
  const tone =
    status === "LIVE"
      ? "bg-live/12 text-live border-live/35"
      : status === "REGISTRATION_OPEN"
        ? "bg-verified/12 text-verified border-verified/35"
        : status === "COMPLETED" || status === "CANCELLED"
          ? "bg-muted text-done border-border"
          : "bg-upcoming/10 text-upcoming border-upcoming/25";
  return (
    <span
      className={cn(
        "font-ui inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
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
        "font-ui inline-flex items-center gap-1 rounded-full border border-verified/30 bg-verified/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-verified",
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
    PENDING: "border-warning/35 bg-warning/12 text-warning-ink",
    VERIFIED: "border-verified/30 bg-verified/10 text-verified",
    REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
  };
  const label = status === "PENDING" ? "Pending verification" : status === "VERIFIED" ? "Verified" : "Rejected";
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