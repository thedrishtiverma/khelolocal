import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Initials } from "@/components/shared/Bits";
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
    <section className="organizer-banner group rounded-2xl p-5 sm:p-6">
      <div className="organizer-card-topline">
        <div className="organizer-avatar-wrap">
          {organizer.logo ? (
            <img
              src={organizer.logo}
              alt={`${organizer.organizationName} logo`}
              className="organizer-avatar size-16 rounded-2xl object-cover sm:size-18"
            />
          ) : (
            <Initials
              name={organizer.organizationName}
              className="organizer-avatar size-16 rounded-2xl bg-primary text-xl text-primary-foreground sm:size-18"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="organizer-card-eyebrow">
              {eventName ?? (sport ? `${sport} organizer` : "Tournament organizer")}
            </p>
            {organizer.verificationStatus === "VERIFIED" ? (
              <span className="organizer-verified-label">Verified</span>
            ) : null}
          </div>
          <h2 className="mt-2 font-display text-2xl font-black leading-tight text-foreground transition-colors group-hover:text-lime sm:text-3xl">
            {organizer.organizationName}
          </h2>
          <div className="organizer-card-meta mt-3">
            <span>{organizer.organizationType}</span>
            <span className="organizer-meta-divider" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {organizer.cityName}
            </span>
          </div>
        </div>
        {showContacts || actions ? (
          <div className="organizer-card-actions">
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
      <p className="organizer-card-description">{organizer.description}</p>
    </section>
  );
}
