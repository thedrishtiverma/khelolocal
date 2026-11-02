import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  signInWithPassword: vi.fn(),
  getProfileByAuthId: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  getSupabaseClientIfConfigured: () => ({
    auth: {
      getSession: mocks.getSession,
      signInWithPassword: mocks.signInWithPassword,
    },
  }),
  isSupabaseConfigured: () => true,
}));

vi.mock("@/integrations/supabase/auth-helpers", () => ({
  createProfileRecord: vi.fn(),
  createRoleSpecificProfile: vi.fn(),
  getProfileByAuthId: mocks.getProfileByAuthId,
  signOutSupabaseSession: vi.fn(),
  updateProfileRecord: vi.fn(),
  updateRoleSpecificProfile: vi.fn(),
}));

import { KheloProvider, useKhelo } from "./store";

const user: User = {
  id: "auth-user-id",
  name: "Test Athlete",
  email: "athlete@example.test",
  phone: "",
  role: "ATHLETE",
  cityId: "",
  profileImage: "",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  isActive: true,
};

function AuthProbe() {
  const { currentUser, login } = useKhelo();
  return (
    <>
      <p>{currentUser?.email ?? "Signed out"}</p>
      <button onClick={() => void login(" athlete@example.test ", "strong-password")}>
        Sign in
      </button>
    </>
  );
}

describe("KheloProvider authentication", () => {
  beforeEach(() => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: { id: user.id } },
      error: null,
    });
    mocks.getProfileByAuthId.mockResolvedValue(user);
  });

  it("normalizes credentials and publishes the authenticated profile", async () => {
    render(
      <KheloProvider>
        <AuthProbe />
      </KheloProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(screen.getByText(user.email)).toBeInTheDocument());
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: "athlete@example.test",
      password: "strong-password",
    });
  });

  it("does not authenticate when Supabase rejects the credentials", async () => {
    mocks.signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("Invalid login credentials"),
    });
    render(
      <KheloProvider>
        <AuthProbe />
      </KheloProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(mocks.signInWithPassword).toHaveBeenCalled());
    expect(screen.getByText("Signed out")).toBeInTheDocument();
    expect(mocks.getProfileByAuthId).not.toHaveBeenCalled();
  });
});
