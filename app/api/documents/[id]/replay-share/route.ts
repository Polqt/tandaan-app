import { NextResponse } from "next/server";
import { apiErrorResponse, requireAuth } from "@/lib/server/api-utils";
import { setSentryRequestContext } from "@/lib/telemetry/observability";
import { createReplayShareForUser } from "@/services/replay";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const authResult = await requireAuth({ route: "replay-share.post" });
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    setSentryRequestContext({
      roomId: id,
      route: "replay-share.post",
      userId: authResult.userId,
    });
    const replayShare = await createReplayShareForUser(authResult.userId, id);

    if (!replayShare) {
      return apiErrorResponse("Document not found", 404);
    }

    return NextResponse.json(replayShare);
  } catch (error) {
    console.error("Error creating replay share:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
