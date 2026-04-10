import { NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import { apiErrorResponse, requireAuth } from "@/lib/api-utils";
import { createVersionSchema, parseBody } from "@/lib/schemas";
import { computeVersionSummary } from "@/lib/version-utils";
import {
  getReplayTimelineForUser,
  resolveAccessibleRoomId,
} from "@/services/replay";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    const replayTimeline = await getReplayTimelineForUser(
      authResult.userId,
      id,
    );
    if (!replayTimeline) {
      return apiErrorResponse("Document not found", 404);
    }

    return NextResponse.json(replayTimeline);
  } catch (error) {
    console.error("Error fetching document versions:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    const roomId = await resolveAccessibleRoomId(authResult.userId, id);
    if (!roomId) {
      return apiErrorResponse("Document not found", 404);
    }

    const parsed = await parseBody(request, createVersionSchema);
    if (!parsed.success) return parsed.response;

    const versionsCollection = adminDB
      .collection("documents")
      .doc(roomId)
      .collection("versions");
    const latestVersionSnapshot = await versionsCollection
      .orderBy("timeStamp", "desc")
      .limit(1)
      .get();
    const previousContent = latestVersionSnapshot.empty
      ? null
      : (latestVersionSnapshot.docs[0].data().content as string | null);
    const summary = computeVersionSummary(parsed.data.content, previousContent);

    const versionRef = versionsCollection.doc();
    await versionRef.set({
      content: parsed.data.content,
      summary,
      timeStamp: new Date(),
      userId: authResult.userId,
    });

    return NextResponse.json({
      success: true,
      summary,
      versionId: versionRef.id,
    });
  } catch (error) {
    console.error("Error creating document version:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
