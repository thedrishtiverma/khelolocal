import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSeedDatabase } from "@/data/seed";

const mocks = vi.hoisted(() => {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
  };
  return {
    configured: vi.fn(),
    query,
    supabase: {
      from: vi.fn(() => query),
      rpc: vi.fn(),
    },
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  isSupabaseConfigured: mocks.configured,
  supabase: mocks.supabase,
}));

import { loadOperationalState, saveOperationalState } from "./backend-state";

describe("operational state Supabase adapter", () => {
  beforeEach(() => {
    mocks.configured.mockReturnValue(true);
    mocks.query.select.mockReturnValue(mocks.query);
    mocks.query.eq.mockReturnValue(mocks.query);
  });

  it("loads the current state payload and version", async () => {
    const db = createSeedDatabase();
    mocks.query.maybeSingle.mockResolvedValue({
      data: { payload: db, version: 7 },
      error: null,
    });

    await expect(loadOperationalState()).resolves.toEqual({ db, version: 7 });
    expect(mocks.supabase.from).toHaveBeenCalledWith("operational_state");
    expect(mocks.query.eq).toHaveBeenCalledWith("id", "primary");
  });

  it("saves using optimistic concurrency and returns the new version", async () => {
    const db = createSeedDatabase();
    mocks.supabase.rpc.mockResolvedValue({
      data: [{ version: 8, updated_at: "2026-11-02T00:00:00Z" }],
      error: null,
    });

    await expect(saveOperationalState(db, 7)).resolves.toBe(8);
    expect(mocks.supabase.rpc).toHaveBeenCalledWith("save_operational_state", {
      next_payload: db,
      expected_version: 7,
    });
  });

  it("surfaces database write failures", async () => {
    mocks.supabase.rpc.mockResolvedValue({
      data: null,
      error: { message: "State has changed. Refresh and retry." },
    });

    await expect(saveOperationalState(createSeedDatabase(), 7)).rejects.toThrow(
      "State has changed. Refresh and retry.",
    );
  });
});
