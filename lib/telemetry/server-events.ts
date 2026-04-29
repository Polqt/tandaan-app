import { adminDB } from "@/firebase-admin";

type Primitive = boolean | null | number | string;
type EventValue = Primitive | EventValue[] | { [key: string]: EventValue };

type EventMetadata = Record<string, unknown>;

type ServerAnalyticsEventInput = {
  event: string;
  actorUserId?: string | null;
  metadata?: EventMetadata;
  requestId?: string | null;
  roomId?: string | null;
};

type ServerAuditEventInput = {
  action: string;
  actorUserId?: string | null;
  metadata?: EventMetadata;
  requestId?: string | null;
  roomId?: string | null;
  targetId?: string | null;
  targetType?: string | null;
};

type HealthMetrics = {
  authFailures24h: number;
  authWebhookFailures24h: number;
  checkoutFailures24h: number;
  checkoutStarts24h: number;
  recentAuditEvents: number;
  snapshotAverageQueueLatencyMs: number | null;
  snapshotFailures24h: number;
  snapshotMaxQueueLatencyMs: number | null;
  snapshotPersisted24h: number;
  webhookFailures24h: number;
};

const ANALYTICS_COLLECTION = "analyticsEvents";
const AUDIT_COLLECTION = "auditLogs";
const METRIC_LOOKBACK_HOURS = 24;
const METRIC_SAMPLE_LIMIT = 250;

function normalizeEventValue(value: unknown): EventValue {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeEventValue(item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce<Record<string, EventValue>>(
      (accumulator, [key, nestedValue]) => {
        accumulator[key] = normalizeEventValue(nestedValue);
        return accumulator;
      },
      {},
    );
  }

  return String(value);
}

function normalizeMetadata(metadata?: EventMetadata) {
  if (!metadata) {
    return {};
  }

  return Object.entries(metadata).reduce<Record<string, EventValue>>(
    (accumulator, [key, value]) => {
      accumulator[key] = normalizeEventValue(value);
      return accumulator;
    },
    {},
  );
}

export async function recordAnalyticsEventServer({
  event,
  actorUserId = null,
  metadata,
  requestId = null,
  roomId = null,
}: ServerAnalyticsEventInput) {
  await adminDB.collection(ANALYTICS_COLLECTION).add({
    actorUserId,
    createdAt: new Date(),
    event,
    metadata: normalizeMetadata(metadata),
    requestId,
    roomId,
  });
}

export async function recordAuditEventServer({
  action,
  actorUserId = null,
  metadata,
  requestId = null,
  roomId = null,
  targetId = null,
  targetType = null,
}: ServerAuditEventInput) {
  await adminDB.collection(AUDIT_COLLECTION).add({
    action,
    actorUserId,
    createdAt: new Date(),
    metadata: normalizeMetadata(metadata),
    requestId,
    roomId,
    targetId,
    targetType,
  });
}

export async function getOperationalMetrics(): Promise<HealthMetrics> {
  const since = new Date(Date.now() - METRIC_LOOKBACK_HOURS * 60 * 60 * 1000);

  const [analyticsSnapshot, auditSnapshot] = await Promise.all([
    adminDB
      .collection(ANALYTICS_COLLECTION)
      .where("createdAt", ">=", since)
      .orderBy("createdAt", "desc")
      .limit(METRIC_SAMPLE_LIMIT)
      .get(),
    adminDB
      .collection(AUDIT_COLLECTION)
      .where("createdAt", ">=", since)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get(),
  ]);

  let authFailures24h = 0;
  let authWebhookFailures24h = 0;
  let checkoutFailures24h = 0;
  let checkoutStarts24h = 0;
  let snapshotFailures24h = 0;
  let snapshotPersisted24h = 0;
  let webhookFailures24h = 0;
  const snapshotLatencies: number[] = [];

  for (const document of analyticsSnapshot.docs) {
    const data = document.data();
    const event = typeof data.event === "string" ? data.event : "";

    if (event === "auth_unauthorized") {
      authFailures24h += 1;
    }

    if (event === "billing_checkout_failed") {
      checkoutFailures24h += 1;
    }

    if (event === "billing_webhook_failed") {
      webhookFailures24h += 1;
    }

    if (event === "billing_checkout_started") {
      checkoutStarts24h += 1;
    }

    if (event === "auth_webhook_failed") {
      authWebhookFailures24h += 1;
      webhookFailures24h += 1;
    }

    if (event === "snapshot_task_failed") {
      snapshotFailures24h += 1;
    }

    if (event === "snapshot_persisted") {
      snapshotPersisted24h += 1;
      const queueLatencyMs = data.metadata?.queueLatencyMs;
      if (
        typeof queueLatencyMs === "number" &&
        Number.isFinite(queueLatencyMs)
      ) {
        snapshotLatencies.push(queueLatencyMs);
      }
    }
  }

  const snapshotAverageQueueLatencyMs =
    snapshotLatencies.length > 0
      ? Math.round(
          snapshotLatencies.reduce((sum, value) => sum + value, 0) /
            snapshotLatencies.length,
        )
      : null;

  const snapshotMaxQueueLatencyMs =
    snapshotLatencies.length > 0 ? Math.max(...snapshotLatencies) : null;

  return {
    authFailures24h,
    authWebhookFailures24h,
    checkoutFailures24h,
    checkoutStarts24h,
    recentAuditEvents: auditSnapshot.size,
    snapshotAverageQueueLatencyMs,
    snapshotFailures24h,
    snapshotMaxQueueLatencyMs,
    snapshotPersisted24h,
    webhookFailures24h,
  };
}
