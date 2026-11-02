import { cn } from "@/lib/utils";
import { sportTone } from "@/lib/sport-visuals";
import {
  resolveKheloBannerAsset,
  ROLE_BANNER_REGISTRY,
  sportBannerPath,
} from "@/components/shared/khelo-icon-registry";
import type { KheloRole } from "@/components/shared/khelo-icon-registry";

export function BannerArtwork({
  sportId,
  role,
  className,
}: {
  sportId?: string;
  role?: KheloRole;
  className?: string;
}) {
  const assetPath = sportId ? sportBannerPath(sportId) : undefined;
  const rolePath = role ? ROLE_BANNER_REGISTRY[role] : undefined;
  const asset = resolveKheloBannerAsset(assetPath ?? rolePath);

  return (
    <div
      className={cn("khelo-banner-art", className)}
      data-sport-tone={sportId ? sportTone(sportId) : undefined}
      aria-hidden="true"
    >
      {asset ? (
        <img
          src={asset}
          alt=""
          aria-hidden="true"
          className="khelo-banner-geometry"
          data-sport-banner={sportId}
          data-role-banner={!assetPath ? role : undefined}
        />
      ) : null}
    </div>
  );
}
