import { adminDB } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { parseBody } from "@/lib/schemas";
import { resolveAccessibleRoomId } from "@/services/replay";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchVersionSchema = z.object({
  chapterLabel: z.string().max(80).trim(),
});

type RouteContext = {
  params: Promise<{ id: string; versionId: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) return authResult.error;

    const { id, versionId } = await params;

    // Only the document owner can set chapter labels
    const roomSnap = await adminDB
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms")
      .doc(id)
      .get();

    if (!roomSnap.exists || roomSnap.data()?.role !== "owner") {
      return apiErrorResponse("Only the document owner can set chapter labels", 403);
    }

    const roomId = await resolveAccessibleRoomId(authResult.userId, id);
    if (!roomId) return apiErrorResponse("Document not found", 404);

    const parsed = await parseBody(request, patchVersionSchema);
    if (!parsed.success) return parsed.response;

    const versionRef = adminDB
      .collection("documents")
      .doc(roomId)
      .collection("versions")
      .doc(versionId);

    const versionSnap = await versionRef.get();
    if (!versionSnap.exists) return apiErrorResponse("Version not found", 404);

    await versionRef.update({
      chapterLabel: parsed.data.chapterLabel || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error patching version:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
