import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { adminDB } from "@/firebase-admin";
import { buildRoomListDocument } from "@/lib/docs/document-list";
import { setSentryRequestContext } from "@/lib/telemetry/observability";
import {
  recordAnalyticsEventServer,
  recordAuditEventServer,
} from "@/lib/telemetry/server-events";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

type ClerkUserEvent =
  | {
      type: "user.created";
      data: {
        email_addresses: Array<{ email_address: string }>;
        first_name: string | null;
        id: string;
        last_name: string | null;
      };
    }
  | {
      type: "user.deleted";
      data: {
        id: string;
      };
    };

type ClerkUserCreatedData = {
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  id: string;
  last_name: string | null;
};

type ClerkUserDeletedData = {
  id: string;
};

export async function POST(req: Request) {
  setSentryRequestContext({
    route: "clerk.webhook",
    tags: { provider: "clerk" },
  });

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  const body = await req.text();

  let event: ClerkUserEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const rawEvent = wh.verify(body, {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    }) as { type: string; data: ClerkUserCreatedData | ClerkUserDeletedData };

    // Type narrowing based on event type
    if (rawEvent.type === "user.deleted") {
      event = {
        type: "user.deleted",
        data: rawEvent.data as ClerkUserDeletedData,
      };
    } else if (rawEvent.type === "user.created") {
      event = {
        type: "user.created",
        data: rawEvent.data as ClerkUserCreatedData,
      };
    } else {
      // For unknown event types, treat as deleted for type safety
      event = {
        type: "user.deleted",
        data: rawEvent.data as ClerkUserDeletedData,
      };
    }
  } catch {
    await recordAnalyticsEventServer({
      event: "auth_webhook_failed",
      metadata: { provider: "clerk", reason: "invalid_signature" },
    });
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  if (event.type === "user.deleted") {
    return handleUserDeleted(event.data);
  }

  if (event.type !== "user.created") {
    return NextResponse.json({ received: true });
  }

  return handleUserCreated(event.data);
}

/**
 * Handle user.created event - create user profile and process pending invites
 */
async function handleUserCreated(
  data: ClerkUserCreatedData,
): Promise<NextResponse> {
  const { email_addresses, first_name, id, last_name } = data;
  const email = email_addresses[0]?.email_address ?? "";

  // Create user profile
  await adminDB
    .collection("users")
    .doc(id)
    .set({
      createdAt: new Date(),
      email,
      firstName: first_name ?? "",
      lastName: last_name ?? "",
    });

  let invitedRoomCount = 0;

  // Process pending invites if email exists
  if (email) {
    const pendingSnap = await adminDB
      .collection("pendingInvites")
      .where("email", "==", email)
      .get();

    if (!pendingSnap.empty) {
      invitedRoomCount = pendingSnap.size;
      await processPendingInvites(id, email, pendingSnap.docs);
    }
  }

  return NextResponse.json({ success: true, invitedRoomCount });
}

/**
 * Process all pending invites for a new user - uses batch operations for efficiency
 */
async function processPendingInvites(
  userId: string,
  email: string,
  pendingDocs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[],
): Promise<void> {
  // Fetch all documents in parallel for efficiency (avoid N+1 queries)
  const roomIds = pendingDocs.map((p) => p.data().roomId as string);
  const documentRefs = roomIds.map((roomId) =>
    adminDB.collection("documents").doc(roomId),
  );
  const documentSnaps = await adminDB.getAll(...documentRefs);
  const documentsByRoomId = new Map(
    documentSnaps
      .filter((snap) => snap.exists)
      .map((snap) => [snap.id, snap.data()]),
  );

  const batch = adminDB.batch();
  const analyticsEvents: Array<Promise<void>> = [];

  for (const pending of pendingDocs) {
    const pendingData = pending.data() as {
      invitedBy?: string;
      roomId: string;
    };
    const { roomId, invitedBy } = pendingData;

    // Get document data if exists
    const documentData = documentsByRoomId.get(roomId);

    batch.set(
      adminDB.collection("users").doc(userId).collection("rooms").doc(roomId),
      {
        createdAt: new Date(),
        document: buildRoomListDocument(roomId, documentData ?? null),
        role: "editor",
        roomId,
        userId,
      },
    );
    batch.delete(pending.ref);

    // Queue analytics events (will be awaited together)
    analyticsEvents.push(
      recordAnalyticsEventServer({
        actorUserId: userId,
        event: "invite_accepted",
        metadata: { email, invitedBy: invitedBy ?? null },
        roomId,
      }),
    );
    analyticsEvents.push(
      recordAuditEventServer({
        action: "invite.accepted",
        actorUserId: userId,
        metadata: { email, invitedBy: invitedBy ?? null },
        roomId,
        targetId: roomId,
        targetType: "document",
      }),
    );
  }

  // Commit batch and analytics in parallel
  await Promise.all([batch.commit(), Promise.all(analyticsEvents)]);
}

/**
 * Handle user.deleted event - clean up all user data from Firestore
 */
async function handleUserDeleted(
  data: ClerkUserDeletedData,
): Promise<NextResponse> {
  const { id: userId } = data;

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  // Delete all rooms subcollection entries
  const roomsSnap = await adminDB
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .get();

  const batch = adminDB.batch();

  // Delete each room membership
  roomsSnap.forEach((roomDoc) => {
    batch.delete(roomDoc.ref);
  });

  // Delete user profile
  batch.delete(adminDB.collection("users").doc(userId));

  // Delete pending invites where this user was the inviter
  const invitedBySnap = await adminDB
    .collection("pendingInvites")
    .where("invitedBy", "==", userId)
    .get();

  invitedBySnap.forEach((inviteDoc) => {
    batch.delete(inviteDoc.ref);
  });

  await batch.commit();

  await recordAnalyticsEventServer({
    actorUserId: userId,
    event: "user_deleted",
    metadata: {
      deletedRoomCount: roomsSnap.size,
      deletedInviteCount: invitedBySnap.size,
    },
  });

  return NextResponse.json({ success: true, deletedRooms: roomsSnap.size });
}
