import { getApps } from "firebase-admin/app";
import { NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import { getQStashClient } from "@/lib/server/qstash";
import { getRequestId } from "@/lib/server/request-id";
import { withRequestHeaders } from "@/lib/server/response";
import { getOperationalMetrics } from "@/lib/telemetry/server-events";

function getOperationalChecks() {
  return {
    firebaseAdmin: getApps().length > 0,
    qstashConfigured: Boolean(getQStashClient()),
    sentryConfigured: Boolean(
      process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    ),
    snapshotQueueConfigured: Boolean(
      process.env.QSTASH_TOKEN &&
        process.env.SNAPSHOT_TASK_SECRET &&
        process.env.NEXT_PUBLIC_APP_URL,
    ),
  };
}

export async function HEAD() {
  const requestId = await getRequestId();
  return withRequestHeaders(new NextResponse(null, { status: 200 }), requestId);
}

export async function GET() {
  const requestId = await getRequestId();

  try {
    const [_, metrics] = await Promise.all([
      adminDB.listCollections(),
      getOperationalMetrics(),
    ]);

    const alerts = [
      metrics.checkoutFailures24h > 3 ? "checkout_failures_elevated" : null,
      metrics.authFailures24h > 20 ? "auth_failures_elevated" : null,
      metrics.webhookFailures24h > 3 ? "webhook_failures_elevated" : null,
      metrics.snapshotFailures24h > 0 ? "snapshot_tasks_failing" : null,
      metrics.snapshotMaxQueueLatencyMs !== null &&
      metrics.snapshotMaxQueueLatencyMs > 60_000
        ? "snapshot_queue_latency_high"
        : null,
    ].filter((value): value is string => Boolean(value));

    return withRequestHeaders(
      NextResponse.json({
        alerts,
        checks: getOperationalChecks(),
        metrics,
        status: alerts.length > 0 ? "degraded" : "ok",
        timestamp: new Date().toISOString(),
      }),
      requestId,
    );
  } catch (error) {
    return withRequestHeaders(
      NextResponse.json(
        {
          alerts: ["health_check_failed"],
          checks: {
            ...getOperationalChecks(),
            firebaseReachable: false,
          },
          error: error instanceof Error ? error.message : "Health check failed",
          status: "degraded",
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      ),
      requestId,
    );
  }
}
