import type { ReactNode, SVGProps } from "react";
import {
  ACTIVITY_ICON_REGISTRY,
  ROLE_ICON_REGISTRY,
  STATUS_ICON_REGISTRY,
} from "@/components/shared/khelo-icon-registry";
import type {
  KheloActivity,
  KheloIconName,
  KheloRole,
  KheloStatus,
} from "@/components/shared/khelo-icon-registry";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name">;

function IconDrawing({ name }: { name: KheloIconName }): ReactNode {
  switch (name) {
    case "brand-local":
      return (
        <>
          <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" />
          <path d="M17 31V17l14 14V17" />
          <circle cx="35" cy="13" r="2" />
        </>
      );
    case "sport-football":
      return (
        <>
          <circle cx="24" cy="24" r="19" />
          <path d="m18 18 6-4 6 4-2 7h-8l-2-7Z" />
          <path d="m18 18-7-2m7 2-3 10m18-10 7-2m-7 2 3 10m-19 0-5 7m8-10 1 11m8-11-1 11m8-8-5-7" />
        </>
      );
    case "sport-kabaddi":
      return (
        <>
          <circle cx="24" cy="9" r="4" />
          <path d="m21 14-5 9 8 5 7-7 6 3m-21-1-6 7 8 5 4-7m1-5-3 12 7 7m0-16 7 5-2 9" />
          <path d="M8 16h6m-8 5h5m29-9h-6" />
        </>
      );
    case "sport-basketball":
      return (
        <>
          <circle cx="24" cy="24" r="19" />
          <path d="M8 13c10 2 18 10 20 27M40 13c-10 2-18 10-20 27M5 24h38M24 5c-5 8-5 30 0 38" />
        </>
      );
    case "sport-kho-kho":
      return (
        <>
          <path d="M7 39h34M11 34h26M15 29h18" />
          <circle cx="14" cy="13" r="3" />
          <path d="m12 18 7 4 4 7m-11-8-5 6m12-5 7-4m-3 12 7 8m-8-8-8 8" />
          <path d="M30 13h8m-5-4v8" />
        </>
      );
    case "sport-badminton":
      return (
        <>
          <path d="m14 13 13 13m-8-18 14 14m-19-9 13-7m-8 18 14-14" />
          <path d="m27 26 7 7m-9-5-5 5m9-7 5-5" />
          <path d="m34 33 5 5-3 3-5-5" />
          <path d="M35 10c4 3 6 6 7 10" />
        </>
      );
    case "sport-boxing":
      return (
        <>
          <path d="M10 26c0-6 4-10 10-10h4c3 0 5 2 5 5v4h4c4 0 6 3 6 7v4H14c-3 0-4-2-4-5v-5Z" />
          <path d="M19 16v-4c0-3 2-5 5-5s5 2 5 5v9m-19 7h9m14 4h6" />
          <path d="M10 26h8c3 0 5 2 5 5v5" />
        </>
      );
    case "sport-yoga":
      return (
        <>
          <circle cx="24" cy="9" r="4" />
          <path d="m22 14-8 9 10 5 10-5-8-9m-2 14v6m-13 6 4-7h18l4 7H11Z" />
          <path d="M7 18c3-6 8-10 14-12m20 12c-3-6-8-10-14-12" />
        </>
      );
    case "sport-volleyball":
      return (
        <>
          <circle cx="24" cy="24" r="19" />
          <path d="M24 5c-4 8-4 15 0 21m0-21c7 4 11 9 13 16M5 24c8-1 14 1 19 7m19-7c-8 4-14 9-18 19M11 10c2 8 7 13 13 14" />
        </>
      );
    case "sport-table-tennis":
      return (
        <>
          <path d="M13 11c-5 5-5 14 0 19s13 5 18 0L17 16" />
          <path d="m28 29 9 9m-4-22 4 4m-12-9 4 4" />
          <circle cx="37" cy="11" r="3" />
          <path d="M5 41h38" />
        </>
      );
    case "sport-tennis":
      return (
        <>
          <ellipse cx="22" cy="19" rx="12" ry="15" transform="rotate(35 22 19)" />
          <path d="m28 29 11 11m-20-32c5 5 10 10 15 15M14 14l15 15" />
          <circle cx="39" cy="10" r="3" />
        </>
      );
    case "sport-athletics":
      return (
        <>
          <circle cx="29" cy="8" r="4" />
          <path d="m25 14-8 8 9 5 6-6 7 2m-22-1-8 1m17 4-8 8m-4-13-5 10m17-10 7 12m-7-7 9 4" />
          <path d="M5 9h9M4 15h6M3 21h5" />
        </>
      );
    case "role-athlete":
      return (
        <>
          <circle cx="24" cy="12" r="6" />
          <path d="M13 41c0-8 5-14 11-14s11 6 11 14" />
          <path d="M17 30 12 36m19-6 5 6M18 42l6-4 6 4" />
        </>
      );
    case "role-team":
      return (
        <>
          <circle cx="24" cy="15" r="5" />
          <circle cx="10" cy="20" r="4" />
          <circle cx="38" cy="20" r="4" />
          <path d="M14 40c0-7 4-12 10-12s10 5 10 12m-29 0c0-6 3-10 8-11m21 0c5 1 8 5 8 11" />
        </>
      );
    case "role-coach":
      return (
        <>
          <path d="M11 7h20l6 6v28H11V7Z" />
          <path d="M31 7v7h6M17 21h14m-14 7h9" />
          <circle cx="35" cy="34" r="7" />
          <path d="m33 34 2 2 4-5" />
        </>
      );
    case "role-organizer":
      return (
        <>
          <path d="M10 11h20l8 8v22H10V11Z" />
          <path d="M30 11v9h8m-22 7h15m-15 6h9" />
          <path d="m37 5 1.5 3.5L42 10l-3.5 1.5L37 15l-1.5-3.5L32 10l3.5-1.5L37 5Z" />
        </>
      );
    case "role-institution":
      return (
        <>
          <path d="m5 17 19-11 19 11M8 20h32M10 20v19m9-19v19m10-19v19m9-19v19M6 42h36" />
          <path d="M16 14h16" />
        </>
      );
    case "role-scout":
      return (
        <>
          <path d="M6 16h8l4 4h12l4-4h8v15h-8l-4-4H18l-4 4H6V16Z" />
          <circle cx="13" cy="23" r="3" />
          <circle cx="35" cy="23" r="3" />
          <path d="m18 20 2-5h8l2 5" />
        </>
      );
    case "role-volunteer":
      return (
        <>
          <path d="M24 40 9 26c-7-7 3-17 10-10l5 5 5-5c7-7 17 3 10 10L24 40Z" />
          <path d="M6 31h9l5 5h8c3 0 4-4 1-5l-5-2m-8-4 5 5" />
        </>
      );
    case "role-admin":
      return (
        <>
          <path d="M24 5 40 11v12c0 10-6 16-16 20C14 39 8 33 8 23V11l16-6Z" />
          <path d="m17 24 5 5 10-11m-8-8v4" />
        </>
      );
    case "activity-tournament":
      return (
        <>
          <path d="M16 7h16v10c0 7-3 11-8 11s-8-4-8-11V7Zm8 21v9m-9 4h18m-9-4v-4" />
          <path d="M16 11H9v4c0 5 3 8 8 8m15-12h7v4c0 5-3 8-8 8" />
          <path d="m24 11 1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5 1.5-3Z" />
        </>
      );
    case "activity-match":
      return (
        <>
          <circle cx="16" cy="14" r="5" />
          <circle cx="32" cy="14" r="5" />
          <path d="M7 38c0-7 4-12 9-12s9 5 9 12m-1-10c2-1 4-2 8-2 5 0 9 5 9 12M6 42h36" />
        </>
      );
    case "activity-fixture":
      return (
        <>
          <rect x="7" y="10" width="34" height="31" rx="3" />
          <path d="M15 6v8m18-8v8M7 19h34m-25 8h4m7 0h4m-15 7h4m7 0h4" />
        </>
      );
    case "activity-score":
      return (
        <>
          <rect x="6" y="9" width="36" height="30" rx="3" />
          <path d="M13 18h6v12h-6m14-12 6 12 6-12m-6 12v4" />
        </>
      );
    case "activity-result":
      return (
        <>
          <path d="M24 5 29 9l7-1 2 7 6 4-3 7 1 7-7 3-4 6-7-3-7 3-4-6-7-3 1-7-3-7 6-4 2-7 7 1 5-4Z" />
          <path d="m16 24 5 5 11-12" />
        </>
      );
    case "activity-achievement":
      return (
        <>
          <circle cx="24" cy="18" r="12" />
          <path d="m18 29-3 14 9-5 9 5-3-14m-6-20 2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5 2-5Z" />
        </>
      );
    case "activity-verification":
      return (
        <>
          <path d="m24 5 5 3 6-1 2 6 5 4-2 6 2 6-5 4-2 6-6-1-5 3-5-3-6 1-2-6-5-4 2-6-2-6 5-4 2-6 6 1 5-3Z" />
          <path d="m16 24 5 5 11-12" />
        </>
      );
    case "activity-registration":
      return (
        <>
          <path d="M13 8h22v34H13V8Z" />
          <path d="M19 8V5h10v3m-9 12h8m-8 7h8m-8 7h5" />
          <path d="M36 31v10m-5-5h10" />
        </>
      );
    case "activity-roster":
      return (
        <>
          <circle cx="17" cy="15" r="5" />
          <circle cx="33" cy="15" r="5" />
          <path d="M7 39c0-7 4-12 10-12s10 5 10 12m-1-10c2-1 4-2 7-2 6 0 10 5 10 12M6 43h36" />
        </>
      );
    case "activity-venue":
      return (
        <>
          <path d="M38 20c0 10-14 23-14 23S10 30 10 20a14 14 0 1 1 28 0Z" />
          <circle cx="24" cy="20" r="5" />
          <path d="M21 20h6m-3-3v6" />
        </>
      );
    case "activity-discovery":
      return (
        <>
          <circle cx="21" cy="21" r="13" />
          <path d="m31 31 11 11M17 25l3-9 6 6-9 3Z" />
        </>
      );
    case "activity-connection":
      return (
        <>
          <path d="M19 29 15 33a7 7 0 0 1-10-10l8-8a7 7 0 0 1 10 0m6 12 4-4a7 7 0 0 1 10 10l-8 8a7 7 0 0 1-10 0" />
          <path d="m17 31 14-14" />
        </>
      );
    case "status-live":
      return (
        <>
          <circle cx="24" cy="24" r="5" />
          <path d="M15 15a13 13 0 0 0 0 18m18-18a13 13 0 0 1 0 18M9 9a21 21 0 0 0 0 30m30-30a21 21 0 0 1 0 30" />
        </>
      );
    case "status-upcoming":
      return (
        <>
          <circle cx="24" cy="24" r="18" />
          <path d="M24 13v12l8 5" />
        </>
      );
    case "status-open":
      return (
        <>
          <path d="M7 41V16l17-9 17 9v25M7 20h34M14 27h7m6 0h7m-20 7h7m6 0h7" />
        </>
      );
    case "status-completed":
      return (
        <>
          <circle cx="24" cy="24" r="19" />
          <path d="m14 24 7 7 14-15" />
        </>
      );
    case "status-verified":
      return (
        <>
          <path d="m24 4 5 4 7-1 2 7 6 4-3 7 2 7-7 3-4 6-7-3-7 3-3-7-6-3 2-7-3-7 6-4 2-7 7 1 3-3Z" />
          <path d="m16 24 5 5 11-12" />
        </>
      );
    case "status-pending":
      return (
        <>
          <circle cx="24" cy="24" r="18" />
          <path d="M18 14h12m-12 20h12m-10-19c0 4 1 6 4 9-3 3-4 5-4 9m8-18c0 4-1 6-4 9 3 3 4 5 4 9" />
        </>
      );
    case "status-full":
      return (
        <>
          <path d="M8 8h32v32H8V8Z" />
          <path d="M8 18h32m-23 9h14m-14 7h14" />
        </>
      );
    case "status-cancelled":
      return (
        <>
          <circle cx="24" cy="24" r="18" />
          <path d="m17 17 14 14m0-14L17 31" />
        </>
      );
    case "status-rejected":
      return (
        <>
          <path d="M24 5 42 38H6L24 5Z" />
          <path d="M24 17v9m0 6v.1" />
        </>
      );
  }
}

export function KheloIcon({ name, ...props }: IconProps & { name: KheloIconName }) {
  const label = props["aria-label"];
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      data-khelo-icon={name}
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      {label ? <title>{label}</title> : null}
      {IconDrawing({ name })}
    </svg>
  );
}

export function RoleIcon({
  role,
  "aria-label": ariaLabel,
  ...props
}: IconProps & { role: KheloRole }) {
  return (
    <KheloIcon
      name={ROLE_ICON_REGISTRY[role]}
      aria-label={ariaLabel ?? `${role} identity`}
      {...props}
    />
  );
}

export function ActivityIcon({ activity, ...props }: IconProps & { activity: KheloActivity }) {
  return <KheloIcon name={ACTIVITY_ICON_REGISTRY[activity]} {...props} />;
}

export function StatusIcon({ status, ...props }: IconProps & { status: KheloStatus }) {
  return <KheloIcon name={STATUS_ICON_REGISTRY[status]} {...props} />;
}
