import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BannerArtwork } from "@/components/shared/BannerArtwork";
import { KheloIcon } from "@/components/shared/KheloIcon";
import {
  ACTIVITY_CATALOG,
  ACTIVITY_ICON_REGISTRY,
  ROLE_CATALOG,
  ROLE_ICON_REGISTRY,
  SPORT_CATALOG,
  SPORT_ICON_REGISTRY,
  STATUS_CATALOG,
  STATUS_ICON_REGISTRY,
} from "@/components/shared/khelo-icon-registry";
import type { KheloIconName } from "@/components/shared/khelo-icon-registry";

const iconNames: KheloIconName[] = [
  "brand-local",
  ...Object.values(SPORT_ICON_REGISTRY).map(({ icon }) => icon),
  ...Object.values(ROLE_ICON_REGISTRY),
  ...Object.values(ACTIVITY_ICON_REGISTRY),
  ...Object.values(STATUS_ICON_REGISTRY),
];

describe("KheloLocal icon registry", () => {
  it("provides an original pictogram and banner composition for each sport", () => {
    expect(SPORT_CATALOG).toHaveLength(12);
    const compositions = new Set<string>();

    for (const sportId of SPORT_CATALOG) {
      const { icon, label } = SPORT_ICON_REGISTRY[sportId];
      const markup = renderToStaticMarkup(<KheloIcon name={icon} aria-label={label} />);
      const banner = renderToStaticMarkup(<BannerArtwork sportId={sportId} />);

      expect(markup).toContain(`data-khelo-icon="${icon}"`);
      expect(markup).toContain(`aria-label="${label}"`);
      expect(markup).toMatch(/<(path|circle|rect|ellipse)\b/);
      expect(banner).toContain(`data-sport-banner="${sportId}"`);
      const geometry = banner.match(
        new RegExp(`<svg[^>]*data-sport-banner="${sportId}"[^>]*>(.*?)<\\/svg>`),
      )?.[1];
      expect(geometry).toMatch(/<(path|circle|rect|ellipse)\b/);
      compositions.add(geometry ?? "");
    }

    expect(SPORT_ICON_REGISTRY.khokho).toEqual(SPORT_ICON_REGISTRY["kho-kho"]);
    expect(compositions.size).toBe(SPORT_CATALOG.length);
  });

  it("defines unique role identities for all eight KheloLocal roles", () => {
    expect(ROLE_CATALOG).toHaveLength(8);
    expect(Object.keys(ROLE_ICON_REGISTRY)).toEqual(ROLE_CATALOG);
    expect(new Set(Object.values(ROLE_ICON_REGISTRY)).size).toBe(ROLE_CATALOG.length);
  });

  it("defines sport-network activity and status icons", () => {
    expect(ACTIVITY_CATALOG).toHaveLength(12);
    expect(Object.keys(ACTIVITY_ICON_REGISTRY)).toEqual(ACTIVITY_CATALOG);
    expect(Object.keys(STATUS_ICON_REGISTRY)).toEqual(STATUS_CATALOG);
    expect(STATUS_CATALOG).toContain("full");
    expect(STATUS_CATALOG).toContain("live");
    expect(STATUS_CATALOG).toContain("verified");
  });

  it.each([...new Set(iconNames)])("draws the %s symbol", (name) => {
    const markup = renderToStaticMarkup(<KheloIcon name={name} />);

    expect(markup).toContain(`data-khelo-icon="${name}"`);
    expect(markup).toMatch(/<(path|circle|rect|ellipse)\b/);
  });
});
