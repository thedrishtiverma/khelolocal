import { describe, expect, it } from "vitest";
import { normalizeRole, normalizeRoleForDatabase, profileToUser } from "./auth-helpers";

describe("Supabase profile mapping", () => {
  it("normalizes all supported non-admin signup roles", () => {
    expect(normalizeRole("institution")).toBe("COLLEGE");
    expect(normalizeRole("scout")).toBe("SCOUT");
    expect(normalizeRoleForDatabase("COLLEGE")).toBe("institution");
  });

  it("preserves disabled account state when mapping a profile", () => {
    expect(
      profileToUser({
        id: "profile-id",
        role: "athlete",
        is_active: false,
      }),
    ).toMatchObject({ id: "profile-id", role: "ATHLETE", isActive: false });
  });
});
