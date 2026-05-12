import { getFirestore } from "firebase-admin/firestore";
import { auth } from "@clerk/nextjs/server";
import { adminApp } from "@/firebase-admin";
import {
  apiErrorResponseWithRequestId,
  apiSuccessResponseWithRequestId,
} from "@/lib/server/api-utils";
import { getRequestId } from "@/lib/server/request-id";
import { loggerWithRequest } from "@/lib/telemetry/logger";

const db = getFirestore(adminApp);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "share.get" });

  try {
    const { shareId } = await params;

    if (!shareId || shareId.length < 10) {
      return apiErrorResponseWithRequestId(
        "Invalid share link",
        requestId,
        400,
      );
    }

    // Search for the share link across all users' rooms
    // This is a bit expensive, so we optimize by checking recent shares first
    // In production, you might want to use a dedicated collection for all shares
    // Try to find the share - iterate through known patterns
    // For better performance, we'd store a global share index
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      // Not authenticated - return 401 to trigger sign-in flow
      return apiErrorResponseWithRequestId(
        "Authentication required",
        requestId,
        401,
      );
    }

    // Get all rooms for this user and check for matching share
    const roomsSnap = await db
      .collection("users")
      .doc(clerkUserId)
      .collection("rooms")
      .get();

    for (const roomDoc of roomsSnap.docs) {
      const shareDoc = await roomDoc.ref.collection("shares").doc(shareId).get();

      if (shareDoc.exists) {
        const shareData = shareDoc.data();

        if (!shareData) {
          continue;
        }

        // Check if expired
        if (shareData.expiresAt?.toDate?.() < new Date()) {
          return apiErrorResponseWithRequestId(
            "Share link has expired",
            requestId,
            404,
          );
        }

        // Check if user has access to the document
        const roomData = roomDoc.data();
        if (!roomData) continue;

        const documentId = roomData.roomId ?? roomDoc.id;

        return apiSuccessResponseWithRequestId(
          {
            share: {
              id: shareId,
              documentId,
              expiresAt: shareData.expiresAt?.toDate?.()?.toISOString(),
              createdBy: shareData.createdBy,
            },
          },
          requestId,
        );
      }
    }

    return apiErrorResponseWithRequestId(
      "Share link not found or expired",
      requestId,
      404,
    );
  } catch (error) {
    logger.error({ error }, "Error resolving share link");
    return apiErrorResponseWithRequestId(
      "Internal Server Error",
      requestId,
      500,
    );
  }
}
