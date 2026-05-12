import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import { buildRoomListDocument } from "@/lib/docs/document-list";
import { apiErrorResponse, requireAuth } from "@/lib/server/api-utils";

const db = getFirestore(adminApp);

// Default and max page size to prevent large payloads
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * Extracts cursor from request for pagination
 */
function getCursor(request: Request): string | undefined {
  const url = new URL(request.url);
  return url.searchParams.get("cursor") ?? undefined;
}

/**
 * Extracts limit from request with validation
 */
function getLimit(request: Request): number {
  const url = new URL(request.url);
  const limitStr = url.searchParams.get("limit");
  const limit = Number.parseInt(limitStr ?? "", 10);

  if (Number.isNaN(limit) || limit < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(limit, MAX_LIMIT);
}

export async function GET(request: Request) {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const cursor = getCursor(request);
    const limit = getLimit(request);

    // Build query with optional cursor
    const roomRef = db
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms")
      .orderBy("createdAt", "desc")
      .limit(limit + 1); // Fetch one extra to determine if there's more

    // Apply cursor if provided
    let query = roomRef;
    if (cursor) {
      const cursorDoc = await db
        .collection("users")
        .doc(authResult.userId)
        .collection("rooms")
        .doc(cursor)
        .get();

      if (cursorDoc.exists) {
        query = roomRef.startAfter(cursorDoc);
      }
    }

    const roomSnap = await query.get();

    // Check if there are more results
    const hasMore = roomSnap.size > limit;
    const rooms = hasMore ? roomSnap.docs.slice(0, limit) : roomSnap.docs;
    const nextCursor = hasMore ? rooms[rooms.length - 1].id : undefined;

    // Identify documents needing metadata sync
    const missingMetadataEntries = rooms.filter((roomDoc) => {
      const roomData = roomDoc.data() as Record<string, unknown>;
      const roomId =
        typeof roomData.roomId === "string" && roomData.roomId.length > 0
          ? roomData.roomId
          : roomDoc.id;

      return (
        !roomData.document ||
        typeof roomData.document !== "object" ||
        buildRoomListDocument(
          roomId,
          roomData.document as Record<string, unknown>,
        ).updatedAt === null
      );
    });

    // Batch fetch missing document metadata
    if (missingMetadataEntries.length > 0) {
      const documentIds = Array.from(
        new Set(
          missingMetadataEntries.map((roomDoc) => {
            const roomData = roomDoc.data() as Record<string, unknown>;
            return typeof roomData.roomId === "string" &&
              roomData.roomId.length > 0
              ? roomData.roomId
              : roomDoc.id;
          }),
        ),
      );

      const documentRefs = documentIds.map((documentId) =>
        db.collection("documents").doc(documentId),
      );

      const documentSnapshots =
        documentRefs.length > 0 ? await db.getAll(...documentRefs) : [];
      const documentsById = new Map(
        documentSnapshots
          .filter((documentSnapshot) => documentSnapshot.exists)
          .map((documentSnapshot) => [
            documentSnapshot.id,
            documentSnapshot.data() as Record<string, unknown>,
          ]),
      );

      // Build response with fallback to fetched metadata
      const documents = rooms.map((roomDoc) => {
        const roomData = roomDoc.data() as Record<string, unknown>;
        const roomId =
          typeof roomData.roomId === "string" && roomData.roomId.length > 0
            ? roomData.roomId
            : roomDoc.id;

        const title =
          roomData.document && typeof roomData.document === "object"
            ? buildRoomListDocument(
                roomId,
                roomData.document as Record<string, unknown>,
              ).title
            : buildRoomListDocument(roomId, documentsById.get(roomId)).title;

        return {
          id: roomId,
          title,
        };
      });

      return NextResponse.json({
        documents,
        nextCursor,
        hasMore,
      });
    }

    // No missing metadata - use cached data directly
    const documents = rooms.map((roomDoc) => {
      const roomData = roomDoc.data() as Record<string, unknown>;
      const roomId =
        typeof roomData.roomId === "string" && roomData.roomId.length > 0
          ? roomData.roomId
          : roomDoc.id;

      const title = buildRoomListDocument(
        roomId,
        (roomData.document as Record<string, unknown>) ?? null,
      ).title;

      return {
        id: roomId,
        title,
      };
    });

    return NextResponse.json({
      documents,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
