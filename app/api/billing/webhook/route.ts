import { adminDB } from "@/firebase-admin";
import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";

const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET;

// Verify PayMongo webhook signature
// Docs: https://developers.paymongo.com/docs/webhooks#verifying-webhooks
function verifySignature(payload: string, sigHeader: string): boolean {
  if (!PAYMONGO_WEBHOOK_SECRET) return false;

  // sigHeader format: "t=<timestamp>,te=<test_sig>,li=<live_sig>"
  const parts = Object.fromEntries(
    sigHeader.split(",").map((part) => part.split("=") as [string, string]),
  );

  const timestamp = parts.t;
  const signature = parts.te ?? parts.li; // te = test, li = live

  if (!timestamp || !signature) return false;

  const toSign = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
    .update(toSign)
    .digest("hex");

  return expected === signature;
}

export async function POST(req: Request) {
  if (!PAYMONGO_WEBHOOK_SECRET) {
    console.error("PAYMONGO_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const sigHeader = req.headers.get("paymongo-signature");
  if (!sigHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  if (!verifySignature(body, sigHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { data: { attributes: { type: string; data: { attributes: { remarks?: string; status?: string } } } } };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.data.attributes.type;
  const paymentData = event.data.attributes.data?.attributes;

  // payment.paid fires when a payment link is fully settled
  if (eventType === "payment.paid") {
    const userId = paymentData?.remarks;
    if (userId) {
      await adminDB.collection("users").doc(userId).update({ plan: "pro" });
    }
  }

  return NextResponse.json({ received: true });
}
