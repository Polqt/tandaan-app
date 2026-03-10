"use server";

import { randomUUID } from "node:crypto";
import { clerkClient } from "@clerk/nextjs/server";
import { adminDB } from "@/firebase-admin";
import type {
  ReplayProfilesByUserId,
  ReplayTimeline,
  ReplayUserProfile,
  Version,
} from "@/types/version";

const VERSION_LIMIT = 200;

type FirestoreTimestamp = {
  toDate: () => Date;
};

function toIsoTimestamp(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toDate" in value) {
    return (value as FirestoreTimestamp).toDate().toISOString();
  }

  return new Date(0).toISOString();
}

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
  };
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

async function getVersionTimeline(roomId: string) {
  const snapshot = await adminDB
    .collection("documents")
    .doc(roomId)
    .collection("versions")
    .orderBy("timeStamp", "asc")
    .limit(VERSION_LIMIT)
    .get();

  return snapshot.docs.map((document) =>
    mapVersion(document.id, document.data() as Record<string, unknown>),
  );
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
): Promise<ReplayTimeline | null> {
  const [documentSnapshot, versions] = await Promise.all([
    getDocumentSnapshot(roomId),
    getVersionTimeline(roomId),
  ]);

  if (!documentSnapshot.exists) {
    return null;
  }

  const documentData = documentSnapshot.data() as Record<string, unknown>;
  const profilesByUserId = await resolveProfilesByUserId(versions);

  return {
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
    versions,
  };
}

export async function getReplayTimelineForUser(
  userId: string,
  documentId: string,
) {
  const roomId = await resolveAccessibleRoomId(userId, documentId);
  if (!roomId) {
    return null;
  }

  return buildReplayTimeline(roomId);
}

export async function getReplayTimelineByShareId(shareId: string) {
  const snapshot = await adminDB
    .collection("documents")
    .where("replayShareId", "==", shareId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return buildReplayTimeline(snapshot.docs[0].id);
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
  await documentRef.update({
    replayShareId: shareId,
    replaySharedAt: new Date(),
    replaySharedBy: userId,
  });

  return {
    roomId,
    shareId,
  };
}
