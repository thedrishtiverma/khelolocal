import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Initials } from "@/components/shared/Bits";
import { RoleIcon, StatusIcon } from "@/components/shared/KheloIcon";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import { ProfileContactLink } from "@/components/shared/ProfileBanner";
import type { Organizer } from "@/types";

export function OrganizerBanner({
  organizer,
  actions,
  sport,
  eventName,
  showContacts = true,
}: {
  organizer: Organizer;
  actions?: ReactNode;
  sport?: string;
  eventName?: string;
  showContacts?: boolean;
}) {
  return (
    <section className="organizer-banner profile-banner--organizer group rounded-xl p-5 sm:p-6">
      <BannerArtwork
        {...(sport ? { sportId: sport } : {})}
        role="organizer"
        className="profile-banner-artwork"
      />
      <div className="profile-banner-content flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative size-16 shrink-0 sm:size-18">
          {organizer.logo ? (
            <img
              src={organizer.logo}
              alt={`${organizer.organizationName} logo`}
              className="profile-banner-avatar size-16 rounded-xl border-4 object-cover shadow-lg sm:size-18"
            />
          ) : (
            <Initials
              name={organizer.organizationName}
              className="profile-banner-avatar size-16 rounded-xl border-4 bg-primary text-xl text-primary-foreground shadow-lg sm:size-18"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 pb-0.5">
          <p className="profile-banner-eyebrow">
            {eventName ?? (sport ? `${sport} organizer` : "Tournament organizer")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mt-2 font-display text-2xl font-black leading-none text-foreground transition-colors group-hover:text-lime">
              {organizer.organizationName}
            </h2>
            {organizer.verificationStatus === "VERIFIED" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-verified/30 bg-verified/10 px-2 py-1 text-xs font-semibold text-verified">
                <StatusIcon status="verified" className="size-3.5" /> Verified organizer
              </span>
            ) : null}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <RoleIcon role="organizer" className="size-3.5" /> {organizer.organizationType}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" /> {organizer.cityName}
            </span>
          </p>
        </div>
        {showContacts || actions ? (
          <div className="organizer-banner-aside flex flex-wrap gap-2 sm:max-w-56 sm:flex-col sm:items-stretch">
            {showContacts && organizer.email ? (
              <ProfileContactLink
                href={`mailto:${organizer.email}`}
                label={organizer.email}
                icon={<Mail className="size-4 shrink-0" aria-hidden="true" />}
              />
            ) : null}
            {showContacts && organizer.phone ? (
              <ProfileContactLink
                href={`tel:${organizer.phone}`}
                label={organizer.phone}
                icon={<Phone className="size-4 shrink-0" aria-hidden="true" />}
              />
            ) : null}
            {actions}
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{organizer.description}</p>
    </section>
  );
}
