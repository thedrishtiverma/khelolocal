import { describe, expect, it } from "vitest";

import { renderErrorPage } from "./error-page";

describe("renderErrorPage", () => {
  it("renders a branded, responsive KheloLocal 500 page", () => {
    const page = renderErrorPage();

    expect(page).toContain("<title>The match is paused | KheloLocal</title>");
    expect(page).toContain("KheloLocal / 500");
    expect(page).toContain("The match is paused.");
    expect(page).toContain("Play paused");
    expect(page).toContain("@media (max-width: 700px)");
    expect(page).toContain('href="/"');
  });

  it("keeps a retry action available for server failures", () => {
    expect(renderErrorPage()).toContain('onclick="location.reload()"');
  });
});
