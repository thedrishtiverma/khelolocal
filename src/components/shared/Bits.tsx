import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stat({
  value,
  label,
  tone = "default",
  className,
}: {
  value: ReactNode;
  label: string;
  tone?: "default" | "accent" | "invert";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "stat-num text-3xl sm:text-4xl",
          tone === "accent" && "text-lime",
          tone === "invert" && "text-surface-foreground",
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "font-ui text-[11px] font-semibold uppercase tracking-widest",
          tone === "invert" ? "text-surface-foreground/60" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <As className="text-2xl font-bold sm:text-3xl">{title}</As>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="data-card-muted rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="data-card-muted flex items-center justify-center gap-3 rounded-xl border border-border px-6 py-16 text-sm text-muted-foreground">
      <span className="size-3 animate-pulse rounded-full bg-lime" />
      {label}
    </div>
  );
}

export function Initials({
  name,
  className,
  tint,
}: {
  name: string;
  className?: string;
  /** Optional sport tint (see lib/sport-visuals). Defaults to navy. */
  tint?: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md font-heading font-bold",
        tint ?? "bg-primary text-primary-foreground",
        className,
      )}
    >
      {initials}
    </div>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10", className)}>
      {children}
    </div>
  );
}
