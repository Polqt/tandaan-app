import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import { setSentryRequestContext } from "@/lib/telemetry/observability";
import {
  recordAnalyticsEventServer,
  recordAuditEventServer,
} from "@/lib/telemetry/server-events";
import { PLAN_LIMITS } from "@/types/billing";

const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET;

// Expected amount in centavos (299 PHP = 29900 centavos)
const EXPECTED_AMOUNT = PLAN_LIMITS.pro.price * 100;

/**
 * Validates PayMongo webhook signature
 */
function verifySignature(payload: string, sigHeader: string): boolean {
  if (!PAYMONGO_WEBHOOK_SECRET) {
    return false;
  }

  const parts = Object.fromEntries(
    sigHeader.split(",").map((part) => part.split("=") as [string, string]),
  );

  const timestamp = parts.t;
  const signature = parts.te ?? parts.li;

  if (!timestamp || !signature) {
    return false;
  }

  const toSign = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
    .update(toSign)
    .digest("hex");

  return expected === signature;
}

type WebhookEvent = {
  data: {
    attributes: {
      data: {
        attributes: {
          amount?: number;
          remarks?: string;
          status?: string;
        };
        id: string;
        type: string;
      };
      type: string;
    };
  };
};

export async function POST(req: Request) {
  setSentryRequestContext({
    route: "billing.webhook",
    tags: { provider: "paymongo" },
  });

  if (!PAYMONGO_WEBHOOK_SECRET) {
    console.error("PAYMONGO_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const sigHeader = req.headers.get("paymongo-signature");
  if (!sigHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  if (!verifySignature(body, sigHeader)) {
    await recordAnalyticsEventServer({
      event: "billing_webhook_failed",
      metadata: { provider: "paymongo", reason: "invalid_signature" },
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: WebhookEvent;

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.data.attributes.type;
  const paymentData = event.data.attributes.data?.attributes;
  const paymentId = event.data.attributes.data?.id;

  // Route to appropriate handler
  switch (eventType) {
    case "payment.paid":
      return handlePaymentPaid(paymentData, paymentId);
    case "payment.failed":
      return handlePaymentFailed(paymentData);
    case "source.chargeable":
      // Payment source is ready to be charged
      return handleSourceChargeable(paymentData);
    default:
      return NextResponse.json({ received: true });
  }
}

/**
 * Handle successful payment - validate amount before upgrading
 */
async function handlePaymentPaid(
  paymentData: WebhookEvent["data"]["attributes"]["data"]["attributes"],
  paymentId?: string,
): Promise<NextResponse> {
  const userId = paymentData?.remarks;
  const amount = paymentData?.amount;
  const status = paymentData?.status;

  // Validate: ensure userId exists
  if (!userId) {
    await recordAnalyticsEventServer({
      event: "billing_webhook_failed",
      metadata: { reason: "missing_user_id", paymentId },
    });
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  // SECURITY: Validate amount matches expected price
  if (amount !== EXPECTED_AMOUNT) {
    await recordAnalyticsEventServer({
      actorUserId: userId,
      event: "billing_webhook_failed",
      metadata: {
        reason: "invalid_amount",
        expected: EXPECTED_AMOUNT,
        received: amount,
        paymentId,
      },
    });
    // Log but don't reveal actual amount to potential attacker
    return NextResponse.json(
      { error: "Invalid payment amount" },
      { status: 400 },
    );
  }

  // Verify payment status is "paid"
  if (status !== "paid") {
    await recordAnalyticsEventServer({
      actorUserId: userId,
      event: "billing_webhook_failed",
      metadata: { reason: "invalid_status", status, paymentId },
    });
    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 },
    );
  }

  // Upgrade user to pro
  await adminDB.collection("users").doc(userId).update({ plan: "pro" });

  await Promise.all([
    recordAnalyticsEventServer({
      actorUserId: userId,
      event: "billing_payment_succeeded",
      metadata: { provider: "paymongo", paymentId },
    }),
    recordAuditEventServer({
      action: "billing.plan_upgraded",
      actorUserId: userId,
      metadata: { provider: "paymongo", source: "webhook", paymentId },
      targetId: userId,
      targetType: "user",
    }),
  ]);

  return NextResponse.json({ success: true, upgraded: true });
}

/**
 * Handle failed payment - log for investigation
 */
async function handlePaymentFailed(
  paymentData: WebhookEvent["data"]["attributes"]["data"]["attributes"],
): Promise<NextResponse> {
  const userId = paymentData?.remarks;
  const status = paymentData?.status;

  if (userId) {
    await Promise.all([
      recordAnalyticsEventServer({
        actorUserId: userId,
        event: "billing_payment_failed",
        metadata: { provider: "paymongo", status },
      }),
      recordAuditEventServer({
        action: "billing.payment_failed",
        actorUserId: userId,
        metadata: { provider: "paymongo", status },
        targetId: userId,
        targetType: "user",
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle source chargeable - this is when a payment link is created and ready
 */
async function handleSourceChargeable(
  _paymentData: WebhookEvent["data"]["attributes"]["data"]["attributes"],
): Promise<NextResponse> {
  // This event indicates a checkout link was opened - no action needed
  // The actual payment.paid event will handle the upgrade
  return NextResponse.json({ received: true });
}
