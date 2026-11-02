import type { ReactNode } from "react";
import { Initials, KeywordHighlight } from "@/components/shared/Bits";
import { RoleIcon } from "@/components/shared/KheloIcon";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import type { KheloRole } from "@/components/shared/khelo-icon-registry";
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
  sport?: string;
  role?: KheloRole;
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
  sport,
  role,
}: ProfileBannerProps) {
  return (
    <section
      className={cn(
        "profile-banner data-card overflow-hidden rounded-2xl p-0",
        `profile-banner-${accent}`,
        sport ? `profile-banner-sport-${sport}` : undefined,
      )}
    >
      <div className="profile-banner-art khelo-banner-surface relative h-44 overflow-hidden sm:h-52">
        <BannerArtwork sportId={sport} role={role} />
        <span className="profile-banner-eyebrow absolute left-5 top-5 z-10 sm:left-8 sm:top-6">
          {eyebrow}
        </span>
      </div>
      <div className="relative px-5 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-3">
        <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end">
          <div className="relative size-24 shrink-0 sm:size-28">
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
            {role ? (
              <span className="profile-role-mark absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-full border-2 border-card bg-surface text-lime shadow-md">
                <RoleIcon role={role} className="size-5" />
              </span>
            ) : null}
          </div>
          <div className="min-w-0 flex-1 pb-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-black leading-none sm:text-4xl">
                <KeywordHighlight text={title ?? name} />
              </h1>
              {status}
            </div>
            {subtitle ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{subtitle}</p>
            ) : null}
            {meta ? <div className="mt-2 text-sm text-muted-foreground">{meta}</div> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2 sm:pb-1">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
