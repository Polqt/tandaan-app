import { adminDB } from "@/firebase-admin";
import { Webhook } from "svix";
import { NextResponse } from "next/server";

// Set this in your Clerk dashboard → Webhooks → signing secret
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

type ClerkUserEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
  };
};

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  let event: ClerkUserEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  // Only handle user.created — extend as needed
  if (event.type !== "user.created") {
    return NextResponse.json({ received: true });
  }

  const { id, email_addresses, first_name, last_name } = event.data;

  await adminDB.collection("users").doc(id).set({
    email: email_addresses[0]?.email_address ?? "",
    firstName: first_name ?? "",
    lastName: last_name ?? "",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
