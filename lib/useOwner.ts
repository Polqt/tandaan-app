"use client";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";

export default function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.emailAddresses[0]?.emailAddress || !room.id) {
      setIsOwner(false);
      setLoading(false);
      return;
    }

    const checkOwnership = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms/${room.id}/users`);

        if (!response.ok) {
          throw new Error("Failed to fetch room users");
        }

        const { users } = await response.json();
        const userEmail = user.emailAddresses[0].emailAddress;

        const isUserOwner = users.some(
          (u: any) => u.userId === userEmail && u.role === "owner",
        );
        setIsOwner(isUserOwner);
      } catch (error) {
        console.error("Error checking ownership:", error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [user, room?.id]);

  return isOwner;
}
