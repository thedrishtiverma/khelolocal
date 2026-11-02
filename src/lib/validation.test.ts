import { describe, expect, it } from "vitest";
import { passwordResetValidationError } from "./validation";

describe("passwordResetValidationError", () => {
  it("requires a password of at least eight characters", () => {
    expect(passwordResetValidationError("short", "short")).toBe("Use at least 8 characters.");
  });

  it("requires matching confirmation", () => {
    expect(passwordResetValidationError("long-enough", "different")).toBe(
      "Passwords do not match.",
    );
  });

  it("accepts a matching password", () => {
    expect(passwordResetValidationError("long-enough", "long-enough")).toBeNull();
  });
});
