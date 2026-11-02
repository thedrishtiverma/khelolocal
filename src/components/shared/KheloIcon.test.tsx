import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import { KheloIcon } from "@/components/shared/KheloIcon";
import {
  ACTIVITY_CATALOG,
  ACTIVITY_ICON_REGISTRY,
  canonicalSportId,
  ROLE_BANNER_REGISTRY,
  ROLE_CATALOG,
  ROLE_ICON_REGISTRY,
  SPORT_CATALOG,
  SPORT_ICON_REGISTRY,
  STATUS_CATALOG,
  STATUS_ICON_REGISTRY,
  sportIconLabel,
  sportIconName,
  resolveKheloBannerAsset,
  resolveKheloIconAsset,
} from "@/components/shared/khelo-icon-registry";
import type { KheloIconName } from "@/components/shared/khelo-icon-registry";

const iconNames: KheloIconName[] = [
  "brand-local",
  ...Object.values(SPORT_ICON_REGISTRY).map(({ icon }) => icon),
  ...Object.values(ROLE_ICON_REGISTRY),
  ...Object.values(ACTIVITY_ICON_REGISTRY),
  ...Object.values(STATUS_ICON_REGISTRY),
];

describe("KheloLocal icons and banner artwork", () => {
  it("maps every supported sport to a distinct supplied icon and banner asset", () => {
    expect(SPORT_CATALOG).toHaveLength(11);
    const iconPaths = new Set<string>();
    const bannerPaths = new Set<string>();

    for (const sportId of SPORT_CATALOG) {
      const { icon, label, iconPath, bannerPath } = SPORT_ICON_REGISTRY[sportId];
      const iconUrl = resolveKheloIconAsset(icon);
      const bannerUrl = resolveKheloBannerAsset(bannerPath);
      const iconMarkup = renderToStaticMarkup(<KheloIcon name={icon} aria-label={label} />);
      const bannerMarkup = renderToStaticMarkup(<BannerArtwork sportId={sportId} />);

      expect(iconUrl).toBeTruthy();
      expect(bannerUrl).toBeTruthy();
      expect(iconMarkup).toContain(`data-khelo-icon="${icon}"`);
      expect(iconMarkup).toContain(`>${label}</title>`);
      expect(bannerMarkup).toContain("khelo-banner-geometry");
      expect(bannerMarkup).toContain(`data-sport-banner="${sportId}"`);
      iconPaths.add(iconPath);
      bannerPaths.add(bannerPath);
    }

    expect(iconPaths.size).toBe(11);
    expect(bannerPaths.size).toBe(11);
  });

  it("canonicalizes sport names, aliases, casing, and separators", () => {
    expect(canonicalSportId("Kho Kho")).toBe("kho-kho");
    expect(canonicalSportId("Kho-Kho")).toBe("kho-kho");
    expect(canonicalSportId("kHo_kHo")).toBe("kho-kho");
    expect(canonicalSportId("Table Tennis")).toBe("table-tennis");
    expect(canonicalSportId("TABLE-TENNIS")).toBe("table-tennis");
    expect(sportIconName("Kho Kho")).toBe(SPORT_ICON_REGISTRY["kho-kho"].icon);
    expect(sportIconLabel("Table Tennis")).toBe("Table Tennis");
  });

  it("maps all role identities and role banners to separate supplied assets", () => {
    expect(ROLE_CATALOG).toHaveLength(8);
    expect(Object.keys(ROLE_ICON_REGISTRY)).toEqual(ROLE_CATALOG);
    expect(new Set(Object.values(ROLE_ICON_REGISTRY)).size).toBe(ROLE_CATALOG.length);
    expect(Object.keys(ROLE_BANNER_REGISTRY)).toEqual(ROLE_CATALOG);

    const iconUrls = ROLE_CATALOG.map((role) => resolveKheloIconAsset(ROLE_ICON_REGISTRY[role]));
    const bannerUrls = ROLE_CATALOG.map((role) =>
      resolveKheloBannerAsset(ROLE_BANNER_REGISTRY[role]),
    );
    expect(iconUrls.every(Boolean)).toBe(true);
    expect(bannerUrls.every(Boolean)).toBe(true);
    expect(new Set(iconUrls).size).toBe(ROLE_CATALOG.length);
    expect(new Set(bannerUrls).size).toBe(ROLE_CATALOG.length);
  });

  it("uses supplied assets for the activity and status variants present in the kit", () => {
    expect(ACTIVITY_CATALOG).toHaveLength(12);
    expect(Object.keys(ACTIVITY_ICON_REGISTRY)).toEqual(ACTIVITY_CATALOG);
    expect(Object.keys(STATUS_ICON_REGISTRY)).toEqual(STATUS_CATALOG);

    for (const name of Object.values(ACTIVITY_ICON_REGISTRY)) {
      const url = resolveKheloIconAsset(name);
      if (name !== "activity-roster") expect(url).toBeTruthy();
    }
    for (const name of Object.values(STATUS_ICON_REGISTRY)) {
      const url = resolveKheloIconAsset(name);
      if (
        [
          "status-live",
          "status-upcoming",
          "status-completed",
          "status-verified",
          "status-pending",
          "status-full",
        ].includes(name)
      ) {
        expect(url).toBeTruthy();
      }
    }
  });

  it("uses the brand mark for unknown sports and renders missing icon drawings safely", () => {
    expect(canonicalSportId("Cricket")).toBeUndefined();
    expect(sportIconName("Cricket")).toBe("brand-local");
    expect(sportIconLabel("Cricket")).toBe("Uncatalogued sport: Cricket");
    expect(resolveKheloIconAsset("activity-roster")).toBeUndefined();
    expect(() => renderToStaticMarkup(<KheloIcon name="activity-roster" />)).not.toThrow();
    expect(renderToStaticMarkup(<KheloIcon name="activity-roster" />)).toContain(
      'data-khelo-icon="activity-roster"',
    );
    expect(renderToStaticMarkup(<BannerArtwork sportId="Cricket" />)).toContain(
      'data-khelo-icon="brand-local"',
    );
    expect(renderToStaticMarkup(<BannerArtwork sportId="Cricket" role="team" />)).toContain(
      'data-khelo-icon="brand-local"',
    );
  });

  it.each([...new Set(iconNames)])("renders an inline vector for %s", (name) => {
    const markup = renderToStaticMarkup(<KheloIcon name={name} />);

    expect(markup).toContain("<svg");
    expect(markup).toContain(`data-khelo-icon="${name}"`);
  });
});
