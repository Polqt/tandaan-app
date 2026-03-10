"use client";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";

/**
 * Hook to check if the current user is the owner of the current room/document
 * @returns boolean indicating if user is the owner
 */
export default function useIsOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!user?.id || !room.id) {
      setIsOwner(false);
      return;
    }

    const controller = new AbortController();

    const checkOwnership = async () => {
      try {
        const response = await fetch(`/api/documents/${room.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch document access");
        }

        const payload = (await response.json()) as {
          role?: "owner" | "editor";
        };
        setIsOwner(payload.role === "owner");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error checking ownership:", error);
        setIsOwner(false);
      }
    };

    checkOwnership();

    return () => {
      controller.abort();
    };
  }, [user?.id, room.id]);

  return isOwner;
}
