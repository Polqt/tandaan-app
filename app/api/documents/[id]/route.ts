import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/firebase-admin";
import { syncRoomDocumentMetadata } from "@/lib/docs/document-list";
import {
  apiErrorResponseWithRequestId,
  apiSuccessResponseWithRequestId,
  requireAuth,
} from "@/lib/server/api-utils";
import {
  reserveIdempotencyKey,
  storeIdempotencyResponse,
} from "@/lib/server/idempotency";
import { checkSaveRateLimit } from "@/lib/server/rate-limit";
import { getRequestId } from "@/lib/server/request-id";
import { parseBody, patchDocumentSchema } from "@/lib/server/schemas";
import { loggerWithRequest } from "@/lib/telemetry/logger";
import { setSentryRequestContext } from "@/lib/telemetry/observability";

const db = getFirestore(adminApp);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "documents.get" });
  try {
    const authResult = await requireAuth({
      requestId,
      route: "documents.get",
    });
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    setSentryRequestContext({
      requestId,
      roomId: id,
      route: "documents.get",
      userId: authResult.userId,
    });

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

    const roomId = roomData?.roomId ?? id;
    const docSnap = await db.collection("documents").doc(roomId).get();

    if (!docSnap.exists) {
      return apiErrorResponseWithRequestId(
        "Document not found",
        requestId,
        404,
      );
    }

    const documentData = docSnap.data();
    const documentId = docSnap.id;

    return apiSuccessResponseWithRequestId(
      {
        id: documentId,
        ...roomData,
        document: {
          ...(documentData ?? {}),
          id: documentId,
        },
      },
      requestId,
    );
  } catch (error) {
    logger.error({ error }, "Error fetching document");
    return apiErrorResponseWithRequestId(
      "Internal Server Error",
      requestId,
      500,
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "documents.patch" });
  try {
    const authResult = await requireAuth({
      requestId,
      route: "documents.patch",
    });
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    setSentryRequestContext({
      requestId,
      roomId: id,
      route: "documents.patch",
      userId: authResult.userId,
    });
    const rateLimit = await checkSaveRateLimit(
      `${authResult.userId}:document-save:${id}`,
    );
    if (!rateLimit.success) {
      return apiErrorResponseWithRequestId(
        "Too many save requests. Please try again.",
        requestId,
        429,
      );
    }

    const parsed = await parseBody(request, patchDocumentSchema);
    if (!parsed.success) return parsed.response;

    const idempotencyKey =
      parsed.data.idempotencyKey || request.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      const reservation = await reserveIdempotencyKey({
        key: idempotencyKey,
        scope: `document-patch:${authResult.userId}:${id}`,
      });
      if (!reservation.reserved) {
        logger.info({ idempotencyKey }, "Duplicate document patch ignored");
        if (reservation.replay) {
          return apiSuccessResponseWithRequestId(
            reservation.replay.body,
            requestId,
          );
        }
        return apiSuccessResponseWithRequestId(
          { duplicate: true, success: true },
          requestId,
        );
      }
    }

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
    const userRole = roomData?.role;
    
    // Only owners can modify content; editors can only view
    if (userRole !== "owner" && parsed.data.content !== undefined) {
      return apiErrorResponseWithRequestId(
        "You don't have permission to edit this document",
        requestId,
        403,
      );
    }

    const docId = roomData?.roomId ?? id;
    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (parsed.data.content !== undefined) {
      updatePayload.content = parsed.data.content;
    }
    if (parsed.data.title !== undefined) {
      updatePayload.title = parsed.data.title;
    }

    await db.collection("documents").doc(docId).update(updatePayload);

    if (parsed.data.title !== undefined) {
      await syncRoomDocumentMetadata(docId, {
        ...(roomData?.document && typeof roomData.document === "object"
          ? (roomData.document as Record<string, unknown>)
          : {}),
        ...updatePayload,
      });
    }

    const responsePayload = { success: true };
    if (idempotencyKey) {
      await storeIdempotencyResponse({
        body: responsePayload,
        key: idempotencyKey,
        scope: `document-patch:${authResult.userId}:${id}`,
      });
    }

    return apiSuccessResponseWithRequestId(responsePayload, requestId);
  } catch (error) {
    logger.error({ error }, "Error updating document");
    return apiErrorResponseWithRequestId(
      "Internal Server Error",
      requestId,
      500,
    );
  }
}
