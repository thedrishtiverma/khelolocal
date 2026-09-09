import type { ReactNode } from "react";
import { Initials } from "@/components/shared/Bits";
import { cn } from "@/lib/utils";

interface ProfileBannerProps {
  name: string;
  image?: string;
  eyebrow: string;
  title?: string;
  subtitle?: string;
  meta?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  accent?: "field" | "accent" | "navy";
}

const ACCENT_STYLES = {
  field: "from-verified/35 via-primary to-primary",
  accent: "from-accent/45 via-primary to-primary",
  navy: "from-primary/80 via-surface to-surface",
};

export function ProfileBanner({
  name,
  image,
  eyebrow,
  title,
  subtitle,
  meta,
  status,
  actions,
  accent = "navy",
}: ProfileBannerProps) {
  return (
    <section className="data-card overflow-hidden rounded-2xl p-0">
      <div className={cn("relative h-32 overflow-hidden bg-gradient-to-br sm:h-40", ACCENT_STYLES[accent])}>
        <div className="profile-banner-lines absolute inset-0 opacity-50" />
        <div className="absolute -right-10 -top-20 size-64 rounded-full border border-white/15" />
        <div className="absolute -right-2 -top-12 size-48 rounded-full border border-white/10" />
        <span className="absolute bottom-4 left-5 font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-white/65 sm:left-8">
          {eyebrow}
        </span>
      </div>
      <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
          {image ? (
            <img
              src={image}
              alt={`${name} profile`}
              className="size-24 rounded-2xl border-4 border-card object-cover shadow-lg sm:size-28"
            />
          ) : (
            <Initials
              name={name}
              className="size-24 rounded-2xl border-4 border-card bg-lime text-3xl text-lime-foreground shadow-lg sm:size-28"
            />
          )}
          <div className="min-w-0 flex-1 pb-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-black leading-none sm:text-4xl">{title ?? name}</h1>
              {status}
            </div>
            {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
            {meta ? <div className="mt-2 text-sm text-muted-foreground">{meta}</div> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2 sm:pb-1">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
