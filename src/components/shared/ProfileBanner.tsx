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
    <section
      className={cn(
        "profile-banner data-card overflow-hidden rounded-2xl p-0",
        `profile-banner-${accent}`,
      )}
    >
      <div className="profile-banner-art relative h-36 overflow-hidden sm:h-44">
        <div className="profile-banner-lines absolute inset-0" />
        <div className="profile-banner-orbit profile-banner-orbit-one" aria-hidden="true" />
        <div className="profile-banner-orbit profile-banner-orbit-two" aria-hidden="true" />
        <span className="profile-banner-eyebrow absolute left-5 top-5 sm:left-8 sm:top-6">
          {eyebrow}
        </span>
      </div>
      <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
          {image ? (
            <img
              src={image}
              alt={`${name} profile`}
              className="profile-banner-avatar size-24 rounded-2xl border-4 object-cover shadow-lg sm:size-28"
            />
          ) : (
            <Initials
              name={name}
              className="profile-banner-avatar size-24 rounded-2xl border-4 bg-lime text-3xl text-lime-foreground shadow-lg sm:size-28"
            />
          )}
          <div className="min-w-0 flex-1 pb-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-black leading-none sm:text-4xl">
                {title ?? name}
              </h1>
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
