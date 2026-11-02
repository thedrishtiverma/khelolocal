import type { SVGProps } from "react";
import {
  ACTIVITY_ICON_REGISTRY,
  resolveKheloIconAsset,
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

function BrandFallback({ label, className, style, width, height, ...ariaProps }: IconProps & {
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={className}
      style={style}
      width={width}
      height={height}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : (ariaProps["aria-hidden"] ?? true)}
      data-icon-fallback="brand-local"
    >
      <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" />
      <path d="M17 31V17l14 14V17" />
      <circle cx="35" cy="13" r="2" />
    </svg>
  );
}

export function KheloIcon({ name, ...props }: IconProps & { name: KheloIconName }) {
  const label = props["aria-label"];
  const asset = resolveKheloIconAsset(name);

  if (!asset || name === "brand-local") {
    return <BrandFallback label={label} {...props} />;
  }

  return (
    <img
      src={asset}
      alt={label ?? ""}
      className={props.className}
      style={props.style}
      width={props.width}
      height={props.height}
      role={props.role ?? (label ? "img" : undefined)}
      aria-label={label}
      aria-hidden={label ? props["aria-hidden"] : (props["aria-hidden"] ?? true)}
      data-khelo-icon={name}
    />
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
