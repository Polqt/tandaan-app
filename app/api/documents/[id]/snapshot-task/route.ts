import { NextResponse } from "next/server";
import { persistVersionSnapshot } from "@/lib/docs/version-snapshot";
import {
  reserveIdempotencyKey,
  storeIdempotencyResponse,
} from "@/lib/server/idempotency";
import { getRequestId } from "@/lib/server/request-id";
import { withRequestHeaders } from "@/lib/server/response";
import { loggerWithRequest } from "@/lib/telemetry/logger";
import { recordAnalyticsEventServer } from "@/lib/telemetry/server-events";

type SnapshotTaskPayload = {
  content: string;
  idempotencyKey?: string;
  queuedAt?: string;
  roomId: string;
  userId: string;
};

export async function POST(request: Request) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "snapshot-task" });
  let payload: SnapshotTaskPayload | null = null;
  const retryCountHeader =
    request.headers.get("upstash-retried") ??
    request.headers.get("Upstash-Retried");
  const retryCount = Number.parseInt(retryCountHeader ?? "0", 10) || 0;

  try {
    const bearer = request.headers.get("authorization");
    const expected = process.env.SNAPSHOT_TASK_SECRET;

    if (!expected || bearer !== `Bearer ${expected}`) {
      return withRequestHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        requestId,
      );
    }

    payload = (await request.json()) as SnapshotTaskPayload;
    const { content, roomId, userId, idempotencyKey, queuedAt } = payload;

    if (!content || !roomId || !userId) {
      return withRequestHeaders(
        NextResponse.json({ error: "Invalid payload" }, { status: 400 }),
        requestId,
      );
    }

    if (idempotencyKey) {
      const reservation = await reserveIdempotencyKey({
        key: idempotencyKey,
        scope: `snapshot-task:${roomId}:${userId}`,
      });
      if (!reservation.reserved) {
        logger.info({ idempotencyKey }, "Duplicate snapshot task ignored");
        if (reservation.replay) {
          return withRequestHeaders(
            NextResponse.json(reservation.replay.body, {
              status: reservation.replay.status,
            }),
            requestId,
          );
        }
        return withRequestHeaders(
          NextResponse.json({ duplicate: true, success: true }),
          requestId,
        );
      }
    }

    const result = await persistVersionSnapshot({
      content,
      queuedAt,
      requestId,
      roomId,
      userId,
    });
    logger.info(
      { retryCount, versionId: result.versionId, roomId, userId },
      "Snapshot persisted",
    );

    const responsePayload = { success: true, ...result };
    if (idempotencyKey) {
      await storeIdempotencyResponse({
        body: responsePayload,
        key: idempotencyKey,
        scope: `snapshot-task:${roomId}:${userId}`,
      });
    }

    return withRequestHeaders(NextResponse.json(responsePayload), requestId);
  } catch (error) {
    await recordAnalyticsEventServer({
      actorUserId: payload?.userId ?? null,
      event: "snapshot_task_failed",
      metadata: { retryCount },
      requestId,
      roomId: payload?.roomId ?? null,
    }).catch((analyticsError) => {
      logger.error(
        { analyticsError },
        "Could not record snapshot task failure",
      );
    });
    logger.error({ error }, "Snapshot task failed");
    return withRequestHeaders(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
      requestId,
    );
  }
}
