import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// PayMongo create payment link
// Docs: https://developers.paymongo.com/reference/create-a-payment-link
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!PAYMONGO_SECRET) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 500 });
  }

  const credentials = Buffer.from(`${PAYMONGO_SECRET}:`).toString("base64");

  const res = await fetch("https://api.paymongo.com/v1/links", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: 29900,          // ₱299.00 in centavos
          currency: "PHP",
          description: "Tandaan Pro — monthly subscription",
          remarks: userId,        // store userId so webhook can identify who paid
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("PayMongo checkout error:", error);
    return NextResponse.json({ error: "Failed to create payment link" }, { status: 502 });
  }

  const data = await res.json();
  const checkoutUrl = data?.data?.attributes?.checkout_url as string | undefined;

  if (!checkoutUrl) {
    return NextResponse.json({ error: "No checkout URL returned" }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl });
}
