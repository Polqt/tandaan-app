import {
  apiErrorResponseWithRequestId,
  apiSuccessResponseWithRequestId,
  requireAuth,
} from "@/lib/api-utils";
import { checkSaveRateLimit } from "@/lib/rate-limit";
import {
  reserveIdempotencyKey,
  storeIdempotencyResponse,
} from "@/lib/idempotency";
import { loggerWithRequest } from "@/lib/logger";
import { getRequestId } from "@/lib/request-id";
import { createVersionSchema, parseBody } from "@/lib/schemas";
import { getQStashClient } from "@/lib/qstash";
import { persistVersionSnapshot } from "@/lib/version-snapshot";
import {
  getReplayTimelineForUser,
  resolveAccessibleRoomId,
} from "@/services/replay";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "versions.get" });
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    const replayTimeline = await getReplayTimelineForUser(
      authResult.userId,
      id,
    );
    if (!replayTimeline) {
      return apiErrorResponseWithRequestId("Document not found", requestId, 404);
    }

    return apiSuccessResponseWithRequestId(replayTimeline, requestId);
  } catch (error) {
    logger.error({ error }, "Error fetching document versions");
    return apiErrorResponseWithRequestId("Internal Server Error", requestId, 500);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "versions.post" });
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    const roomId = await resolveAccessibleRoomId(authResult.userId, id);
    if (!roomId) {
      return apiErrorResponseWithRequestId("Document not found", requestId, 404);
    }

    const rateLimit = await checkSaveRateLimit(
      `${authResult.userId}:version-save:${roomId}`,
    );
    if (!rateLimit.success) {
      return apiErrorResponseWithRequestId(
        "Too many version requests. Please try again.",
        requestId,
        429,
      );
    }

    const parsed = await parseBody(request, createVersionSchema);
    if (!parsed.success) return parsed.response;

    const idempotencyKey =
      parsed.data.idempotencyKey || request.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      const reservation = await reserveIdempotencyKey({
        key: idempotencyKey,
        scope: `version:${authResult.userId}:${roomId}`,
      });
      if (!reservation.reserved) {
        logger.info({ idempotencyKey }, "Duplicate version request ignored");
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

    const qstash = getQStashClient();
    if (qstash && process.env.SNAPSHOT_TASK_SECRET && process.env.NEXT_PUBLIC_APP_URL) {
      await qstash.publishJSON({
        body: {
          content: parsed.data.content,
          idempotencyKey,
          roomId,
          userId: authResult.userId,
        },
        headers: {
          Authorization: `Bearer ${process.env.SNAPSHOT_TASK_SECRET}`,
          "x-request-id": requestId,
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/documents/${id}/snapshot-task`,
      });

      const queuedPayload = { queued: true, success: true };
      if (idempotencyKey) {
        await storeIdempotencyResponse({
          body: queuedPayload,
          key: idempotencyKey,
          scope: `version:${authResult.userId}:${roomId}`,
        });
      }

      return apiSuccessResponseWithRequestId(
        queuedPayload,
        requestId,
      );
    }

    const result = await persistVersionSnapshot({
      content: parsed.data.content,
      roomId,
      userId: authResult.userId,
    });

    const responsePayload = {
      success: true,
      summary: result.summary,
      versionId: result.versionId,
    };
    if (idempotencyKey) {
      await storeIdempotencyResponse({
        body: responsePayload,
        key: idempotencyKey,
        scope: `version:${authResult.userId}:${roomId}`,
      });
    }

    return apiSuccessResponseWithRequestId(responsePayload, requestId);
  } catch (error) {
    logger.error({ error }, "Error creating document version");
    return apiErrorResponseWithRequestId("Internal Server Error", requestId, 500);
  }
}
