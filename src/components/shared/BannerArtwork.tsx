import { cn } from "@/lib/utils";
import { sportTone } from "@/lib/sport-visuals";
import { KheloIcon } from "@/components/shared/KheloIcon";
import { ROLE_ICON_REGISTRY, sportIconName } from "@/components/shared/khelo-icon-registry";
import type { KheloRole } from "@/components/shared/khelo-icon-registry";

function SportGeometry({ sportId }: { sportId: string }) {
  switch (sportId) {
    case "football":
      return (
        <>
          <rect x="340" y="22" width="226" height="156" rx="4" />
          <path d="M453 22v156m0-104a26 26 0 1 0 0 52 26 26 0 0 0 0-52Zm-113-20h35v64h-35m191-64h33v64h-33" />
          <path d="m395 42 12-9 12 9-4 14h-16l-4-14Z" />
        </>
      );
    case "cricket":
      return (
        <>
          <path d="M358 38h178v120H358zM442 38v120M388 82h108v32H388z" />
          <path d="M418 86v24m12-24v24m12-24v24m44-59c-8 26-21 45-43 58" />
          <circle cx="496" cy="65" r="5" />
        </>
      );
    case "kabaddi":
      return (
        <>
          <rect x="348" y="27" width="206" height="146" rx="3" />
          <path d="M451 27v146M374 50v100m154-100v100M395 70h112m-112 60h112" />
          <path d="M403 42h48m-48 12h48m0 80h48m-48 12h48" />
        </>
      );
    case "basketball":
      return (
        <>
          <path d="M344 26h218v148H344zM453 26v148m0-92a30 30 0 1 0 0 60 30 30 0 0 0 0-60Zm-109-20h34v72h-34m184-72h34v72h-34" />
          <path d="M499 43c-28 15-44 42-46 79m46-79c25 15 41 42 43 79" />
        </>
      );
    case "kho-kho":
    case "khokho":
      return (
        <>
          <path d="M345 35h220v132H345zM455 35v132M370 53h170m-170 24h170m-170 24h170m-170 24h170m-170 24h170" />
          <circle cx="386" cy="64" r="7" />
          <circle cx="428" cy="112" r="7" />
          <path d="m386 73 12 15 17-4m-4 32 12-12 14 6 8 15" />
        </>
      );
    case "badminton":
      return (
        <>
          <path d="M350 30h210v140H350zM455 30v140m-105-70h210m-184-70v140m158-140v140" />
          <path d="M487 54c20 7 32 19 39 37m-48-26 20-12m-16 23 25-15m-17 26 22-13" />
          <path d="m520 91 17 11-9 14-17-11" />
        </>
      );
    case "boxing":
      return (
        <>
          <path d="M350 32h210v136H350zm0 28h210m-210 30h210m-210 30h210" />
          <path d="M371 32v136m168-136v136m-84-136v18m0 100v18" />
          <path d="M423 74c0-10 7-17 17-17h11c8 0 13 5 13 13v13h14c9 0 15 7 15 16v15h-55c-10 0-15-6-15-16V74Z" />
        </>
      );
    case "yoga":
      return (
        <>
          <circle cx="455" cy="101" r="64" />
          <circle cx="455" cy="101" r="48" />
          <path d="M455 37v20m0 88v20m-64-64h20m88 0h20m-109-45 14 14m62 62 14 14m0-90-14 14m-62 62-14 14" />
          <circle cx="455" cy="84" r="7" />
          <path d="m451 93-20 20 24 11 24-11-20-20m-4 31v17m-30 6 10-13h40l10 13" />
        </>
      );
    case "volleyball":
      return (
        <>
          <path d="M350 35h210v130H350zM350 99h210m-18-64v130m-18-130v130m-18-130v130m-18-130v130" />
          <circle cx="491" cy="66" r="25" />
          <path d="M491 41c-7 10-8 19 0 25m0-25c11 5 19 13 23 24m-48 1c10-1 18 2 25 9" />
        </>
      );
    case "table-tennis":
      return (
        <>
          <path d="M348 76h214v76H348zM455 76v76m-107-48h214m-25-24v76m-164-76v76" />
          <path d="m486 46 21-17 22 22-17 21-26-26Zm25 26 19 19m-114 61v20m76-20v20m-88 0h101" />
          <circle cx="465" cy="52" r="5" />
        </>
      );
    case "tennis":
      return (
        <>
          <path d="M350 29h210v142H350zM455 29v142m-105-71h210m-165-71v142m120-142v142" />
          <ellipse cx="502" cy="67" rx="26" ry="34" transform="rotate(35 502 67)" />
          <path d="m518 91 26 32m-59-75 31 38m-44-21 31 39" />
        </>
      );
    case "athletics":
      return (
        <>
          <path d="M350 45h208c-42 14-67 34-67 56s25 42 67 56H350c42-14 67-34 67-56s-25-42-67-56Z" />
          <path d="M350 64h147c-23 10-36 22-36 37s13 27 36 37H350m0-56h93m-93 38h93" />
          <circle cx="490" cy="67" r="6" />
          <path d="m485 77-13 13 14 8 11-10 12 4m-23-3-12 19m20-10-9 19m11-22 12 17" />
        </>
      );
    default:
      return null;
  }
}

export function BannerArtwork({
  sportId,
  role,
  className,
}: {
  sportId?: string;
  role?: KheloRole;
  className?: string;
}) {
  const sportIcon = sportId ? sportIconName(sportId) : undefined;
  const roleIcon = role ? ROLE_ICON_REGISTRY[role] : undefined;

  return (
    <div
      className={cn("khelo-banner-art", className)}
      data-sport-tone={sportId ? sportTone(sportId) : undefined}
      aria-hidden="true"
    >
      {sportId ? (
        <svg
          className="khelo-banner-geometry"
          viewBox="0 0 600 200"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-sport-banner={sportId}
        >
          <SportGeometry sportId={sportId} />
        </svg>
      ) : null}
      <KheloIcon
        name={sportIcon ?? roleIcon ?? "brand-local"}
        className={sportId ? "khelo-banner-symbol" : "khelo-banner-symbol khelo-banner-symbol-role"}
      />
    </div>
  );
}
