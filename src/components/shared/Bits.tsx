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
          "text-[11px] font-semibold uppercase tracking-widest",
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
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
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
    <div className="rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-6 py-16 text-sm text-muted-foreground">
      <span className="size-3 animate-pulse rounded-full bg-lime" />
      {label}
    </div>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-primary font-display font-bold text-primary-foreground",
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