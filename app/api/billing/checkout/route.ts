import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { setSentryRequestContext } from "@/lib/telemetry/observability";
import { recordAnalyticsEventServer } from "@/lib/telemetry/server-events";

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST() {
  const { userId } = await auth();
  setSentryRequestContext({
    route: "billing.checkout",
    tags: { provider: "paymongo" },
    userId,
  });

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!PAYMONGO_SECRET) {
    await recordAnalyticsEventServer({
      actorUserId: userId,
      event: "billing_checkout_failed",
      metadata: { reason: "billing_not_configured" },
    });
    return NextResponse.json(
      { error: "Billing not configured" },
      { status: 500 },
    );
  }

  const credentials = Buffer.from(`${PAYMONGO_SECRET}:`).toString("base64");
  await recordAnalyticsEventServer({
    actorUserId: userId,
    event: "billing_checkout_started",
    metadata: { provider: "paymongo" },
  });

  const res = await fetch("https://api.paymongo.com/v1/links", {
    body: JSON.stringify({
      data: {
        attributes: {
          amount: 29900,
          currency: "PHP",
          description: "Tandaan Pro - monthly subscription",
          redirect: {
            failed: `${APP_URL}/billing?status=failed`,
            success: `${APP_URL}/billing?status=success`,
          },
          remarks: userId,
        },
      },
    }),
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("PayMongo checkout error:", error);
    await recordAnalyticsEventServer({
      actorUserId: userId,
      event: "billing_checkout_failed",
      metadata: { provider: "paymongo", responseStatus: res.status },
    });
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 502 },
    );
  }

  const data = await res.json();
  const checkoutUrl = data?.data?.attributes?.checkout_url as
    | string
    | undefined;

  if (!checkoutUrl) {
    await recordAnalyticsEventServer({
      actorUserId: userId,
      event: "billing_checkout_failed",
      metadata: { provider: "paymongo", reason: "missing_checkout_url" },
    });
    return NextResponse.json(
      { error: "No checkout URL returned" },
      { status: 502 },
    );
  }

  return NextResponse.json({ checkoutUrl });
}
