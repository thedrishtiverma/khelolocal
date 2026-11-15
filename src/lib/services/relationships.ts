import { ageFromDob } from "@/lib/format";
import type {
  Database,
  ProfileBlock,
  ProfileConnection,
  ProfileConnectionRequest,
  ProfileFollow,
  SavedProfile,
} from "@/types";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

function activeUser(db: Database, profileId: string) {
  const user = db.users.find((item) => item.id === profileId && item.isActive);
  if (!user) throw new Error("An active account is required for this action.");
  return user;
}

function profileArrays(db: Database) {
  db.profileFollows ??= [];
  db.profileConnectionRequests ??= [];
  db.profileConnections ??= [];
  db.profileBlocks ??= [];
  db.savedProfiles ??= [];
  return {
    follows: db.profileFollows,
    requests: db.profileConnectionRequests,
    connections: db.profileConnections,
    blocks: db.profileBlocks,
    saved: db.savedProfiles,
  };
}

export function canonicalPair(profileAId: string, profileBId: string): [string, string] {
  return profileAId < profileBId ? [profileAId, profileBId] : [profileBId, profileAId];
}

export function isProfileBlocked(db: Database, profileAId: string, profileBId: string) {
  return (db.profileBlocks ?? []).some(
    (block) =>
      (block.blockerProfileId === profileAId && block.blockedProfileId === profileBId) ||
      (block.blockerProfileId === profileBId && block.blockedProfileId === profileAId),
  );
}

export function areProfilesConnected(db: Database, profileAId: string, profileBId: string) {
  const [a, b] = canonicalPair(profileAId, profileBId);
  return (db.profileConnections ?? []).some(
    (connection) => connection.profileAId === a && connection.profileBId === b,
  );
}

export function canViewProfile(
  db: Database,
  viewerProfileId: string | null,
  targetProfileId: string,
) {
  const target = db.users.find((user) => user.id === targetProfileId && user.isActive);
  if (!target) return false;
  if (viewerProfileId === targetProfileId) return true;
  if (!viewerProfileId || isProfileBlocked(db, viewerProfileId, targetProfileId)) return false;

  if (target.role === "ATHLETE") {
    const athlete = db.athletes.find((item) => item.userId === targetProfileId);
    if (!athlete) return false;
    const age = ageFromDob(athlete.dateOfBirth);
    if (age === null || age < 18) return false;
  }

  const visibility = target.profileVisibility ?? "private";
  if (visibility === "public") return true;
  return visibility === "network" && areProfilesConnected(db, viewerProfileId, targetProfileId);
}

function assertCanInteract(db: Database, actorProfileId: string, targetProfileId: string) {
  activeUser(db, actorProfileId);
  activeUser(db, targetProfileId);
  if (actorProfileId === targetProfileId)
    throw new Error("You cannot interact with your own profile.");
  if (isProfileBlocked(db, actorProfileId, targetProfileId))
    throw new Error("This relationship is unavailable.");
  if (!canViewProfile(db, actorProfileId, targetProfileId))
    throw new Error("This profile is not available to your account.");
}

export function followProfile(db: Database, followerProfileId: string, followedProfileId: string) {
  assertCanInteract(db, followerProfileId, followedProfileId);
  const { follows } = profileArrays(db);
  if (
    follows.some(
      (follow) =>
        follow.followerProfileId === followerProfileId &&
        follow.followedProfileId === followedProfileId,
    )
  ) {
    return false;
  }
  follows.push({
    id: id("follow"),
    followerProfileId,
    followedProfileId,
    createdAt: now(),
  });
  return true;
}

export function unfollowProfile(
  db: Database,
  followerProfileId: string,
  followedProfileId: string,
) {
  const { follows } = profileArrays(db);
  const existing = follows.length;
  db.profileFollows = follows.filter(
    (follow) =>
      follow.followerProfileId !== followerProfileId ||
      follow.followedProfileId !== followedProfileId,
  );
  return db.profileFollows.length !== existing;
}

function createAcceptedConnection(
  connections: ProfileConnection[],
  profileAId: string,
  profileBId: string,
) {
  const [a, b] = canonicalPair(profileAId, profileBId);
  if (connections.some((connection) => connection.profileAId === a && connection.profileBId === b))
    return;
  connections.push({ id: id("connection"), profileAId: a, profileBId: b, createdAt: now() });
}

export function requestProfileConnection(
  db: Database,
  requesterProfileId: string,
  recipientProfileId: string,
  introductionNote = "",
) {
  assertCanInteract(db, requesterProfileId, recipientProfileId);
  const { requests, connections } = profileArrays(db);
  if (areProfilesConnected(db, requesterProfileId, recipientProfileId))
    throw new Error("You are already connected.");

  const active = requests.find(
    (request) =>
      request.status === "PENDING" &&
      ((request.requesterProfileId === requesterProfileId &&
        request.recipientProfileId === recipientProfileId) ||
        (request.requesterProfileId === recipientProfileId &&
          request.recipientProfileId === requesterProfileId)),
  );
  if (active) {
    if (active.requesterProfileId === requesterProfileId)
      throw new Error("A connection request is already pending.");
    active.status = "ACCEPTED";
    active.respondedAt = now();
    active.updatedAt = active.respondedAt;
    createAcceptedConnection(connections, requesterProfileId, recipientProfileId);
    return active;
  }

  const createdAt = now();
  const request: ProfileConnectionRequest = {
    id: id("request"),
    requesterProfileId,
    recipientProfileId,
    status: "PENDING",
    introductionNote: introductionNote.trim().slice(0, 280),
    createdAt,
    respondedAt: null,
    updatedAt: createdAt,
  };
  requests.push(request);
  return request;
}

export function respondToConnectionRequest(
  db: Database,
  recipientProfileId: string,
  requestId: string,
  decision: "ACCEPTED" | "DECLINED",
) {
  activeUser(db, recipientProfileId);
  const { requests, connections } = profileArrays(db);
  const request = requests.find((item) => item.id === requestId);
  if (!request || request.recipientProfileId !== recipientProfileId || request.status !== "PENDING")
    throw new Error("This request is no longer available.");
  if (isProfileBlocked(db, request.requesterProfileId, recipientProfileId))
    throw new Error("This relationship is unavailable.");

  request.status = decision;
  request.respondedAt = now();
  request.updatedAt = request.respondedAt;
  if (decision === "ACCEPTED")
    createAcceptedConnection(connections, request.requesterProfileId, recipientProfileId);
  return request;
}

export function cancelConnectionRequest(
  db: Database,
  requesterProfileId: string,
  requestId: string,
) {
  activeUser(db, requesterProfileId);
  const request = (db.profileConnectionRequests ?? []).find((item) => item.id === requestId);
  if (!request || request.requesterProfileId !== requesterProfileId || request.status !== "PENDING")
    throw new Error("This request can no longer be cancelled.");
  request.status = "CANCELLED";
  request.respondedAt = now();
  request.updatedAt = request.respondedAt;
  return request;
}

export function removeProfileConnection(
  db: Database,
  actorProfileId: string,
  otherProfileId: string,
) {
  activeUser(db, actorProfileId);
  const { connections } = profileArrays(db);
  const [a, b] = canonicalPair(actorProfileId, otherProfileId);
  const before = connections.length;
  db.profileConnections = connections.filter(
    (connection) => connection.profileAId !== a || connection.profileBId !== b,
  );
  return db.profileConnections.length !== before;
}

export function toggleSavedProfile(db: Database, profileId: string, targetProfileId: string) {
  activeUser(db, profileId);
  const { saved } = profileArrays(db);
  const existing = saved.find(
    (item) => item.profileId === profileId && item.targetProfileId === targetProfileId,
  );
  if (existing) {
    db.savedProfiles = saved.filter(
      (item) => item.profileId !== profileId || item.targetProfileId !== targetProfileId,
    );
    return false;
  }
  assertCanInteract(db, profileId, targetProfileId);
  saved.push({ profileId, targetProfileId, createdAt: now() });
  return true;
}

export function blockProfile(db: Database, blockerProfileId: string, blockedProfileId: string) {
  activeUser(db, blockerProfileId);
  activeUser(db, blockedProfileId);
  if (blockerProfileId === blockedProfileId) throw new Error("You cannot block your own profile.");
  const { follows, requests, connections, blocks } = profileArrays(db);
  if (
    blocks.some(
      (block) =>
        block.blockerProfileId === blockerProfileId && block.blockedProfileId === blockedProfileId,
    )
  ) {
    return false;
  }
  const createdAt = now();
  const block: ProfileBlock = {
    id: id("block"),
    blockerProfileId,
    blockedProfileId,
    createdAt,
  };
  blocks.push(block);
  db.profileFollows = follows.filter(
    (follow) =>
      !(
        (follow.followerProfileId === blockerProfileId &&
          follow.followedProfileId === blockedProfileId) ||
        (follow.followerProfileId === blockedProfileId &&
          follow.followedProfileId === blockerProfileId)
      ),
  );
  const [a, b] = canonicalPair(blockerProfileId, blockedProfileId);
  db.profileConnections = connections.filter(
    (connection) => connection.profileAId !== a || connection.profileBId !== b,
  );
  for (const request of requests) {
    const related =
      (request.requesterProfileId === blockerProfileId &&
        request.recipientProfileId === blockedProfileId) ||
      (request.requesterProfileId === blockedProfileId &&
        request.recipientProfileId === blockerProfileId);
    if (related && request.status === "PENDING") {
      request.status = "CANCELLED";
      request.respondedAt = createdAt;
      request.updatedAt = createdAt;
    }
  }
  return true;
}

export function unblockProfile(db: Database, blockerProfileId: string, blockedProfileId: string) {
  const { blocks } = profileArrays(db);
  const previous = blocks.length;
  db.profileBlocks = blocks.filter(
    (block) =>
      block.blockerProfileId !== blockerProfileId || block.blockedProfileId !== blockedProfileId,
  );
  return db.profileBlocks.length !== previous;
}
