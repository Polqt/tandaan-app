import { adminDB } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const snap = await adminDB.collection("users").doc(authResult.userId).get();
    const plan = snap.data()?.plan === "pro" ? "pro" : "free";

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
