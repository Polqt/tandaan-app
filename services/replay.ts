"use server";

import { randomUUID } from "node:crypto";
import { clerkClient } from "@clerk/nextjs/server";
import { adminDB } from "@/firebase-admin";
import { toIsoTimestamp } from "@/lib/dates/timestamp";
import { syncRoomDocumentMetadata } from "@/lib/docs/document-list";
import {
  recordAnalyticsEventServer,
  recordAuditEventServer,
} from "@/lib/telemetry/server-events";
import type {
  ReplayProfilesByUserId,
  ReplayTimeline,
  ReplayUserProfile,
  Version,
} from "@/types/version";

const VERSION_LIMIT = 200;
const ACTIVITY_PAGE_LIMIT = 20;

type ReplayTimelineOptions = {
  cursor?: string | null;
  includeContent?: boolean;
  limit?: number;
  order?: "asc" | "desc";
};

function mapVersion(id: string, data: Record<string, unknown>): Version {
  return {
    content: typeof data.content === "string" ? data.content : "",
    id,
    summary:
      data.summary && typeof data.summary === "object"
        ? (data.summary as Version["summary"])
        : undefined,
    timeStamp: toIsoTimestamp(data.timeStamp),
    userId: typeof data.userId === "string" ? data.userId : "unknown",
    aiSummary: typeof data.aiSummary === "string" ? data.aiSummary : undefined,
    chapterLabel:
      typeof data.chapterLabel === "string" ? data.chapterLabel : undefined,
  };
}

function clampVersionLimit(limit?: number) {
  if (!limit || Number.isNaN(limit)) {
    return ACTIVITY_PAGE_LIMIT;
  }

  return Math.min(Math.max(limit, 1), VERSION_LIMIT);
}

async function resolveUserProfile(
  client: Awaited<ReturnType<typeof clerkClient>>,
  userId: string,
): Promise<ReplayUserProfile> {
  try {
    const user = await client.users.getUser(userId);

    return {
      avatar: user.imageUrl || "",
      id: user.id,
      name: user.fullName || user.firstName || "Anonymous",
    };
  } catch (error) {
    console.error(`Error resolving replay user ${userId}:`, error);

    return {
      avatar: "",
      id: userId,
      name: "Unknown collaborator",
    };
  }
}

async function resolveProfilesByUserId(
  versions: Version[],
): Promise<ReplayProfilesByUserId> {
  const userIds = Array.from(
    new Set(versions.map((version) => version.userId).filter(Boolean)),
  );

  if (userIds.length === 0) {
    return {};
  }

  const client = await clerkClient();
  const profiles = await Promise.all(
    userIds.map((userId) => resolveUserProfile(client, userId)),
  );

  return profiles.reduce<ReplayProfilesByUserId>((profileMap, profile) => {
    profileMap[profile.id] = profile;
    return profileMap;
  }, {});
}

async function getDocumentSnapshot(roomId: string) {
  return adminDB.collection("documents").doc(roomId).get();
}

async function getVersionTimeline(
  roomId: string,
  {
    cursor,
    includeContent = true,
    limit = VERSION_LIMIT,
    order = "asc",
  }: ReplayTimelineOptions = {},
) {
  const versionsCollection = adminDB
    .collection("documents")
    .doc(roomId)
    .collection("versions");

  let query = versionsCollection
    .orderBy("timeStamp", order)
    .limit(clampVersionLimit(limit) + 1);

  if (cursor) {
    const cursorSnapshot = await versionsCollection.doc(cursor).get();
    if (cursorSnapshot.exists) {
      query = query.startAfter(cursorSnapshot);
    }
  }

  const snapshot = await query.get();
  const docs = snapshot.docs;
  const hasMore = docs.length > clampVersionLimit(limit);
  const pageDocs = hasMore ? docs.slice(0, clampVersionLimit(limit)) : docs;

  const versions = pageDocs.map((document) => {
    const version = mapVersion(
      document.id,
      document.data() as Record<string, unknown>,
    );

    return includeContent ? version : { ...version, content: "" };
  });

  return {
    hasMore,
    nextCursor: hasMore ? pageDocs.at(-1)?.id : undefined,
    versions,
  };
}

export async function resolveAccessibleRoomId(
  userId: string,
  documentId: string,
) {
  const roomSnapshot = await adminDB
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .doc(documentId)
    .get();

  if (!roomSnapshot.exists) {
    return null;
  }

  const roomData = roomSnapshot.data();
  return typeof roomData?.roomId === "string" ? roomData.roomId : documentId;
}

async function buildReplayTimeline(
  roomId: string,
  options?: ReplayTimelineOptions,
): Promise<ReplayTimeline | null> {
  const [documentSnapshot, versionPage] = await Promise.all([
    getDocumentSnapshot(roomId),
    getVersionTimeline(roomId, options),
  ]);

  if (!documentSnapshot.exists) {
    return null;
  }

  const documentData = documentSnapshot.data() as Record<string, unknown>;
  const profilesByUserId = await resolveProfilesByUserId(versionPage.versions);

  return {
    hasMore: versionPage.hasMore,
    nextCursor: versionPage.nextCursor,
    profilesByUserId,
    roomId,
    shareId:
      typeof documentData.replayShareId === "string"
        ? documentData.replayShareId
        : undefined,
    sharedAt:
      documentData.replaySharedAt !== undefined
        ? toIsoTimestamp(documentData.replaySharedAt)
        : undefined,
    title:
      typeof documentData.title === "string" &&
      documentData.title.trim().length > 0
        ? documentData.title
        : "Untitled Document",
    versions: versionPage.versions,
  };
}

export async function getReplayTimelineForUser(
  userId: string,
  documentId: string,
  options?: ReplayTimelineOptions,
) {
  const roomId = await resolveAccessibleRoomId(userId, documentId);
  if (!roomId) {
    return null;
  }

  return buildReplayTimeline(roomId, options);
}

export async function getReplayTimelineByShareId(
  shareId: string,
  options?: ReplayTimelineOptions,
) {
  const snapshot = await adminDB
    .collection("documents")
    .where("replayShareId", "==", shareId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return buildReplayTimeline(snapshot.docs[0].id, options);
}

export async function createReplayShareForUser(
  userId: string,
  documentId: string,
) {
  const roomId = await resolveAccessibleRoomId(userId, documentId);
  if (!roomId) {
    return null;
  }

  const documentRef = adminDB.collection("documents").doc(roomId);
  const documentSnapshot = await documentRef.get();

  if (!documentSnapshot.exists) {
    return null;
  }

  const currentShareId = documentSnapshot.data()?.replayShareId;
  if (typeof currentShareId === "string" && currentShareId.trim().length > 0) {
    return {
      roomId,
      shareId: currentShareId,
    };
  }

  const shareId = randomUUID();
  const updatePayload = {
    replayShareId: shareId,
    replaySharedAt: new Date(),
    replaySharedBy: userId,
  };
  await documentRef.update(updatePayload);
  await syncRoomDocumentMetadata(roomId, {
    ...(documentSnapshot.data() as Record<string, unknown>),
    ...updatePayload,
  });

  await Promise.all([
    recordAnalyticsEventServer({
      actorUserId: userId,
      event: "replay_share_created_server",
      metadata: { shareId },
      roomId,
    }),
    recordAuditEventServer({
      action: "replay.share_created",
      actorUserId: userId,
      metadata: { shareId },
      roomId,
      targetId: shareId,
      targetType: "replay_share",
    }),
  ]);

  return {
    roomId,
    shareId,
  };
}
