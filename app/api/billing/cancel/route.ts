import { adminDB } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    await adminDB.collection("users").doc(authResult.userId).update({
      plan: "free",
      cancelledAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
