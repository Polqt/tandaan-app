import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/firebase-admin";
import {
  apiErrorResponseWithRequestId,
  apiSuccessResponseWithRequestId,
  requireAuth,
} from "@/lib/server/api-utils";
import { getRequestId } from "@/lib/server/request-id";
import { loggerWithRequest } from "@/lib/telemetry/logger";
import { setSentryRequestContext } from "@/lib/telemetry/observability";

const db = getFirestore(adminApp);

// Default share expiry: 30 days
const DEFAULT_EXPIRY_DAYS = 30;
const MAX_EXPIRY_DAYS = 365;

interface ShareLink {
  id: string;
  documentId: string;
  createdAt: Date;
  expiresAt: Date;
  createdBy: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "documents.share.get" });

  try {
    const authResult = await requireAuth({
      requestId,
      route: "documents.share.get",
    });
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    setSentryRequestContext({
      requestId,
      roomId: id,
      route: "documents.share.get",
      userId: authResult.userId,
    });

    // Get all share links for this document
    const sharesSnap = await db
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms")
      .doc(id)
      .collection("shares")
      .get();

    const shares = sharesSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        documentId: id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        expiresAt: data.expiresAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        createdBy: data.createdBy,
        isExpired: data.expiresAt?.toDate?.() < new Date(),
      };
    });

    return apiSuccessResponseWithRequestId({ shares }, requestId);
  } catch (error) {
    logger.error({ error }, "Error fetching share links");
    return apiErrorResponseWithRequestId(
      "Internal Server Error",
      requestId,
      500,
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "documents.share.post" });

  try {
    const authResult = await requireAuth({
      requestId,
      route: "documents.share.post",
    });
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    setSentryRequestContext({
      requestId,
      roomId: id,
      route: "documents.share.post",
      userId: authResult.userId,
    });

    // Verify user owns the document
    const roomRef = db
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms")
      .doc(id);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return apiErrorResponseWithRequestId(
        "Document not found",
        requestId,
        404,
      );
    }

    const roomData = roomSnap.data();
    if (roomData?.role !== "owner") {
      return apiErrorResponseWithRequestId(
        "Only the owner can create share links",
        requestId,
        403,
      );
    }

    // Parse request body
    let expiryDays = DEFAULT_EXPIRY_DAYS;
    try {
      const body = await request.json();
      if (body.expiryDays && typeof body.expiryDays === "number") {
        expiryDays = Math.min(Math.max(body.expiryDays, 1), MAX_EXPIRY_DAYS);
      }
    } catch {
      // Use default expiry if no body provided
    }

    // Generate share ID
    const shareId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);

    // Store share link
    const shareData: Omit<ShareLink, "id"> = {
      documentId: id,
      createdAt: now,
      expiresAt,
      createdBy: authResult.userId,
    };

    await roomRef.collection("shares").doc(shareId).set(shareData);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${appUrl}/share/${shareId}`;

    logger.info({ shareId, expiryDays }, "Created share link");

    return apiSuccessResponseWithRequestId(
      {
        share: {
          id: shareId,
          url: shareUrl,
          expiresAt: expiresAt.toISOString(),
          documentId: id,
        },
      },
      requestId,
    );
  } catch (error) {
    logger.error({ error }, "Error creating share link");
    return apiErrorResponseWithRequestId(
      "Internal Server Error",
      requestId,
      500,
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "documents.share.delete" });

  try {
    const authResult = await requireAuth({
      requestId,
      route: "documents.share.delete",
    });
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("shareId");

    if (!shareId) {
      return apiErrorResponseWithRequestId(
        "Share ID required",
        requestId,
        400,
      );
    }

    // Verify user owns the document
    const roomRef = db
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms")
      .doc(id);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return apiErrorResponseWithRequestId(
        "Document not found",
        requestId,
        404,
      );
    }

    const roomData = roomSnap.data();
    if (roomData?.role !== "owner") {
      return apiErrorResponseWithRequestId(
        "Only the owner can delete share links",
        requestId,
        403,
      );
    }

    // Delete share link
    await roomRef.collection("shares").doc(shareId).delete();

    logger.info({ shareId }, "Deleted share link");

    return apiSuccessResponseWithRequestId({ success: true }, requestId);
  } catch (error) {
    logger.error({ error }, "Error deleting share link");
    return apiErrorResponseWithRequestId(
      "Internal Server Error",
      requestId,
      500,
    );
  }
}