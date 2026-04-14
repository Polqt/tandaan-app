import { NextResponse } from "next/server";
import {
  reserveIdempotencyKey,
  storeIdempotencyResponse,
} from "@/lib/idempotency";
import { loggerWithRequest } from "@/lib/logger";
import { getRequestId } from "@/lib/request-id";
import { withRequestHeaders } from "@/lib/response";
import { persistVersionSnapshot } from "@/lib/version-snapshot";

type SnapshotTaskPayload = {
  content: string;
  idempotencyKey?: string;
  roomId: string;
  userId: string;
};

export async function POST(request: Request) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "snapshot-task" });

  try {
    const bearer = request.headers.get("authorization");
    const expected = process.env.SNAPSHOT_TASK_SECRET;

    if (!expected || bearer !== `Bearer ${expected}`) {
      return withRequestHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        requestId,
      );
    }

    const payload = (await request.json()) as SnapshotTaskPayload;
    const { content, roomId, userId, idempotencyKey } = payload;

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

    const result = await persistVersionSnapshot({ content, roomId, userId });
    logger.info(
      { versionId: result.versionId, roomId, userId },
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

    return withRequestHeaders(
      NextResponse.json(responsePayload),
      requestId,
    );
  } catch (error) {
    logger.error({ error }, "Snapshot task failed");
    return withRequestHeaders(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
      requestId,
    );
  }
}
