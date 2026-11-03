import type { ReactNode } from "react";
import { Initials } from "@/components/shared/Bits";
import { RoleIcon } from "@/components/shared/KheloIcon";
import type { KheloRole } from "@/components/shared/khelo-icon-registry";

interface ProfileBannerProps {
  name: string;
  image?: string;
  eyebrow: string;
  title?: string;
  subtitle?: string;
  meta?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
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
  role,
}: ProfileBannerProps) {
  return (
    <section className="profile-banner group data-card rounded-2xl p-5 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
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
            <h1 className="font-display text-3xl font-black leading-none transition-colors group-hover:text-lime sm:text-4xl">
              {title ?? name}
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
    </section>
  );
}
