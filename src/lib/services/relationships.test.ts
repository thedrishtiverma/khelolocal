import { beforeEach, describe, expect, it } from "vitest";
import { createSeedDatabase } from "@/data/seed";
import type { Database } from "@/types";
import {
  areProfilesConnected,
  blockProfile,
  canViewProfile,
  cancelConnectionRequest,
  followProfile,
  isProfileBlocked,
  removeProfileConnection,
  requestProfileConnection,
  respondToConnectionRequest,
  toggleSavedProfile,
  unblockProfile,
  unfollowProfile,
} from "./relationships";

describe("local profile relationships", () => {
  let db: Database;
  let athleteProfileId: string;

  beforeEach(() => {
    db = createSeedDatabase();
    const athlete = db.athletes.find((item) => item.id === "ath_aarav");
    if (!athlete) throw new Error("Seed athlete is missing.");
    athlete.dateOfBirth = "2000-01-01";
    athleteProfileId = athlete.userId;
  });

  it("follows and unfollows a public profile without duplicate rows", () => {
    expect(followProfile(db, "u_scout", athleteProfileId)).toBe(true);
    expect(followProfile(db, "u_scout", athleteProfileId)).toBe(false);
    expect(db.profileFollows).toHaveLength(1);
    expect(unfollowProfile(db, "u_scout", athleteProfileId)).toBe(true);
    expect(unfollowProfile(db, "u_scout", athleteProfileId)).toBe(false);
    expect(db.profileFollows).toHaveLength(0);
  });

  it("prevents self-following and connecting with yourself", () => {
    expect(() => followProfile(db, "u_scout", "u_scout")).toThrow(
      "You cannot interact with your own profile.",
    );
    expect(() => requestProfileConnection(db, "u_scout", "u_scout")).toThrow(
      "You cannot interact with your own profile.",
    );
  });

  it("sends a bounded note and accepts a request only for its recipient", () => {
    const request = requestProfileConnection(db, "u_scout", athleteProfileId, "  Hello player  ");
    expect(request.introductionNote).toBe("Hello player");
    expect(() =>
      requestProfileConnection(db, "u_scout", athleteProfileId, "Second request"),
    ).toThrow("A connection request is already pending.");
    expect(() => respondToConnectionRequest(db, "u_scout", request.id, "ACCEPTED")).toThrow(
      "This request is no longer available.",
    );

    respondToConnectionRequest(db, athleteProfileId, request.id, "ACCEPTED");
    expect(areProfilesConnected(db, athleteProfileId, "u_scout")).toBe(true);
    expect(db.profileConnections).toHaveLength(1);
  });

  it("declines and cancels pending requests without creating a connection", () => {
    const declined = requestProfileConnection(db, "u_scout", athleteProfileId);
    respondToConnectionRequest(db, athleteProfileId, declined.id, "DECLINED");
    expect(declined.status).toBe("DECLINED");
    expect(areProfilesConnected(db, "u_scout", athleteProfileId)).toBe(false);

    const cancelled = requestProfileConnection(db, "u_scout", athleteProfileId);
    cancelConnectionRequest(db, "u_scout", cancelled.id);
    expect(cancelled.status).toBe("CANCELLED");
    expect(() => cancelConnectionRequest(db, athleteProfileId, cancelled.id)).toThrow(
      "This request can no longer be cancelled.",
    );
  });

  it("turns a reciprocal pending request into one accepted connection", () => {
    requestProfileConnection(db, "u_scout", athleteProfileId);
    const reciprocal = requestProfileConnection(db, athleteProfileId, "u_scout");
    expect(reciprocal.status).toBe("ACCEPTED");
    expect(areProfilesConnected(db, "u_scout", athleteProfileId)).toBe(true);
    expect(db.profileConnections).toHaveLength(1);
  });

  it("removes a connection from either side", () => {
    const request = requestProfileConnection(db, "u_scout", athleteProfileId);
    respondToConnectionRequest(db, athleteProfileId, request.id, "ACCEPTED");
    expect(removeProfileConnection(db, athleteProfileId, "u_scout")).toBe(true);
    expect(removeProfileConnection(db, "u_scout", athleteProfileId)).toBe(false);
    expect(areProfilesConnected(db, "u_scout", athleteProfileId)).toBe(false);
  });

  it("blocks both directions, clears existing relationships, and supports unblock", () => {
    followProfile(db, "u_scout", athleteProfileId);
    requestProfileConnection(db, "u_scout", athleteProfileId);
    expect(blockProfile(db, athleteProfileId, "u_scout")).toBe(true);
    expect(blockProfile(db, athleteProfileId, "u_scout")).toBe(false);
    expect(isProfileBlocked(db, "u_scout", athleteProfileId)).toBe(true);
    expect(db.profileFollows).toHaveLength(0);
    expect(db.profileConnectionRequests?.[0]?.status).toBe("CANCELLED");
    expect(() => followProfile(db, "u_scout", athleteProfileId)).toThrow(
      "This relationship is unavailable.",
    );
    expect(unblockProfile(db, athleteProfileId, "u_scout")).toBe(true);
    expect(isProfileBlocked(db, "u_scout", athleteProfileId)).toBe(false);
  });

  it("respects private, network-only, and minor-profile visibility", () => {
    const target = db.users.find((user) => user.id === athleteProfileId);
    const athlete = db.athletes.find((item) => item.userId === athleteProfileId);
    if (!target || !athlete) throw new Error("Seed profile is missing.");

    target.profileVisibility = "private";
    expect(canViewProfile(db, "u_scout", athleteProfileId)).toBe(false);
    expect(canViewProfile(db, athleteProfileId, athleteProfileId)).toBe(true);
    expect(() => followProfile(db, "u_scout", athleteProfileId)).toThrow(
      "This profile is not available to your account.",
    );

    target.profileVisibility = "network";
    expect(canViewProfile(db, "u_scout", athleteProfileId)).toBe(false);
    const request = requestProfileConnection(db, athleteProfileId, "u_scout");
    respondToConnectionRequest(db, "u_scout", request.id, "ACCEPTED");
    expect(canViewProfile(db, "u_scout", athleteProfileId)).toBe(true);
    expect(canViewProfile(db, "u_college", athleteProfileId)).toBe(false);

    athlete.dateOfBirth = "2012-01-01";
    expect(canViewProfile(db, "u_scout", athleteProfileId)).toBe(false);
  });

  it("keeps saved profiles private to the saving account", () => {
    expect(toggleSavedProfile(db, "u_scout", athleteProfileId)).toBe(true);
    expect(toggleSavedProfile(db, "u_college", athleteProfileId)).toBe(true);
    expect(db.savedProfiles).toHaveLength(2);
    expect(db.savedProfiles?.filter((item) => item.profileId === "u_scout")).toHaveLength(1);

    const target = db.users.find((user) => user.id === athleteProfileId);
    if (!target) throw new Error("Seed profile is missing.");
    target.profileVisibility = "private";
    expect(toggleSavedProfile(db, "u_scout", athleteProfileId)).toBe(false);
    expect(db.savedProfiles?.some((item) => item.profileId === "u_scout")).toBe(false);
  });
});
