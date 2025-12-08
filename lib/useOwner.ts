"use client";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";

export default function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !room.id) {
      setIsOwner(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const checkOwnership = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms/${room.id}/users`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch room users");
        }

        const { users } = await response.json();

        // Check using Clerk userId (not email) since that's what we store in Firestore
        const isUserOwner = users.some(
          (u: any) => u.userId === user.id && u.role === "owner",
        );
        setIsOwner(isUserOwner);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error checking ownership:", error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();

    return () => {
      controller.abort();
    };
  }, [user?.id, room.id]);

  return isOwner;
}
