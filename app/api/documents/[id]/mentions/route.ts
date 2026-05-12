import { NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import { requireAuth } from "@/lib/server/api-utils";
import {
  recordAnalyticsEventServer,
  recordAuditEventServer,
} from "@/lib/telemetry/server-events";

type MentionPayload = {
  mentionedUserIds?: string[];
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth({ route: "documents.mentions" });
  if (!authResult.authorized) {
    return authResult.error;
  }

  const { id } = await params;
  const payload = (await request
    .json()
    .catch(() => null)) as MentionPayload | null;
  const mentionedUserIds = Array.from(
    new Set(
      (payload?.mentionedUserIds ?? []).filter(
        (value): value is string =>
          typeof value === "string" &&
          value.length > 0 &&
          value !== authResult.userId,
      ),
    ),
  );

  if (mentionedUserIds.length === 0) {
    return NextResponse.json({ success: true, notifications: 0 });
  }

  const membershipSnap = await adminDB
    .collection("users")
    .doc(authResult.userId)
    .collection("rooms")
    .doc(id)
    .get();

  if (!membershipSnap.exists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const roomUsersSnap = await adminDB
    .collectionGroup("rooms")
    .where("roomId", "==", id)
    .get();
  const roomUserIds = new Set(
    roomUsersSnap.docs
      .map((doc) => doc.data().userId)
      .filter((value): value is string => typeof value === "string"),
  );
  const eligibleUserIds = mentionedUserIds.filter((userId) =>
    roomUserIds.has(userId),
  );

  if (eligibleUserIds.length === 0) {
    return NextResponse.json({ success: true, notifications: 0 });
  }

  const documentSnap = await adminDB.collection("documents").doc(id).get();
  const documentTitle =
    typeof documentSnap.data()?.title === "string" &&
    documentSnap.data()?.title.trim().length > 0
      ? documentSnap.data()?.title
      : "Untitled";

  const batch = adminDB.batch();
  for (const mentionedUserId of eligibleUserIds) {
    const notificationRef = adminDB
      .collection("users")
      .doc(mentionedUserId)
      .collection("notifications")
      .doc();

    batch.set(notificationRef, {
      createdAt: new Date(),
      documentTitle,
      mentionedBy: authResult.userId,
      roomId: id,
      type: "document_mention",
    });
  }

  await batch.commit();
  await Promise.all([
    recordAnalyticsEventServer({
      actorUserId: authResult.userId,
      event: "document_mentions_created",
      metadata: { mentionCount: eligibleUserIds.length },
      roomId: id,
    }),
    recordAuditEventServer({
      action: "document.mentions_created",
      actorUserId: authResult.userId,
      metadata: {
        mentionCount: eligibleUserIds.length,
        mentionedUserIds: eligibleUserIds,
      },
      roomId: id,
      targetId: id,
      targetType: "document",
    }),
  ]);

  return NextResponse.json({
    notifications: eligibleUserIds.length,
    success: true,
  });
}
