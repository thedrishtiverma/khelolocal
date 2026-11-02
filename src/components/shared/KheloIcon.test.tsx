import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import { KheloIcon } from "@/components/shared/KheloIcon";
import {
  ACTIVITY_CATALOG,
  ACTIVITY_ICON_REGISTRY,
  canonicalSportId,
  ROLE_CATALOG,
  ROLE_ICON_REGISTRY,
  SPORT_CATALOG,
  SPORT_ICON_REGISTRY,
  STATUS_CATALOG,
  STATUS_ICON_REGISTRY,
  sportIconLabel,
  sportIconName,
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
  it("maps every supported sport to a distinct inline icon and banner geometry", () => {
    expect(SPORT_CATALOG).toHaveLength(11);
    const iconNames = new Set<string>();

    for (const sportId of SPORT_CATALOG) {
      const { icon, label } = SPORT_ICON_REGISTRY[sportId];
      const iconMarkup = renderToStaticMarkup(<KheloIcon name={icon} aria-label={label} />);
      const bannerMarkup = renderToStaticMarkup(<BannerArtwork sportId={sportId} />);

      expect(iconMarkup).toContain(`data-khelo-icon="${icon}"`);
      expect(iconMarkup).toContain(`>${label}</title>`);
      expect(bannerMarkup).toContain("khelo-banner-geometry");
      expect(bannerMarkup).toContain(`data-sport-banner="${sportId}"`);
      iconNames.add(icon);
    }

    expect(iconNames.size).toBe(11);
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

  it("maps all role identities to distinct inline icons", () => {
    expect(ROLE_CATALOG).toHaveLength(8);
    expect(Object.keys(ROLE_ICON_REGISTRY)).toEqual(ROLE_CATALOG);
    expect(new Set(Object.values(ROLE_ICON_REGISTRY)).size).toBe(ROLE_CATALOG.length);
  });

  it("covers every activity and status icon with the inline registries", () => {
    expect(ACTIVITY_CATALOG).toHaveLength(12);
    expect(Object.keys(ACTIVITY_ICON_REGISTRY)).toEqual(ACTIVITY_CATALOG);
    expect(Object.keys(STATUS_ICON_REGISTRY)).toEqual(STATUS_CATALOG);
  });

  it("uses the brand mark for unknown sports and safely renders unavailable icon drawings", () => {
    expect(canonicalSportId("Cricket")).toBeUndefined();
    expect(sportIconName("Cricket")).toBe("brand-local");
    expect(sportIconLabel("Cricket")).toBe("Uncatalogued sport: Cricket");
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
