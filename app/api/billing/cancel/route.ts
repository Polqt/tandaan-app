import { NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import { apiErrorResponse, requireAuth } from "@/lib/server/api-utils";
import { setSentryRequestContext } from "@/lib/telemetry/observability";
import {
  recordAnalyticsEventServer,
  recordAuditEventServer,
} from "@/lib/telemetry/server-events";

export async function POST() {
  try {
    const authResult = await requireAuth({ route: "billing.cancel" });
    if (!authResult.authorized) {
      return authResult.error;
    }

    setSentryRequestContext({
      route: "billing.cancel",
      userId: authResult.userId,
    });

    await adminDB.collection("users").doc(authResult.userId).update({
      cancelledAt: new Date(),
      plan: "free",
    });

    await Promise.all([
      recordAnalyticsEventServer({
        actorUserId: authResult.userId,
        event: "billing_cancelled",
      }),
      recordAuditEventServer({
        action: "billing.cancelled",
        actorUserId: authResult.userId,
        targetId: authResult.userId,
        targetType: "user",
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
