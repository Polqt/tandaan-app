import { NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import { apiErrorResponse, requireAuth } from "@/lib/server/api-utils";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const snap = await adminDB.collection("users").doc(authResult.userId).get();
    const plan = snap.data()?.plan === "pro" ? "pro" : "free";

    return NextResponse.json(
      { plan },
      {
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
