import type { ReactNode } from "react";
import { Initials } from "@/components/shared/Bits";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import type { KheloRole } from "@/components/shared/khelo-icon-registry";

interface ProfileBannerProps {
  name: string;
  image?: string;
  eyebrow: string;
  sportId?: string;
  title?: string;
  subtitle?: string;
  meta?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  contacts?: ReactNode;
  role?: KheloRole;
}

export function ProfileBanner({
  name,
  image,
  eyebrow,
  sportId,
  title,
  subtitle,
  meta,
  status,
  actions,
  contacts,
  role,
}: ProfileBannerProps) {
  const bannerRole = role ?? "default";

  return (
    <section
      className={`profile-banner profile-banner--${bannerRole} group rounded-2xl p-5 sm:p-8`}
    >
      <BannerArtwork
        {...(sportId ? { sportId } : {})}
        {...(role ? { role } : {})}
        className="profile-banner-artwork"
      />
      <div className="profile-banner-content flex flex-col gap-5 sm:flex-row sm:items-center">
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
              className="profile-banner-avatar size-24 rounded-2xl border-4 bg-primary text-3xl text-primary-foreground shadow-lg sm:size-28"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 pb-0.5">
          <p className="profile-banner-eyebrow">{eyebrow}</p>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="mt-2 font-display text-3xl font-black leading-none transition-colors group-hover:text-lime sm:text-4xl">
              {title ?? name}
            </h1>
            {status}
          </div>
          {subtitle ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{subtitle}</p>
          ) : null}
          {meta ? <div className="mt-2 text-sm text-muted-foreground">{meta}</div> : null}
        </div>
        {contacts || actions ? (
          <div className="profile-banner-aside flex flex-wrap gap-2 sm:max-w-56 sm:flex-col sm:items-stretch">
            {contacts}
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ProfileContactLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a href={href} className="banner-contact-link">
      {icon}
      <span className="truncate">{label}</span>
    </a>
  );
}
