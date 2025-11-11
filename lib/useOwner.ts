"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);
  const [userInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id)),
  );

  useEffect(() => {
    if (
      userInRoom?.docs &&
      userInRoom.docs.length > 0 &&
      user?.emailAddresses[0]
    ) {
      const owners = userInRoom.docs.filter(
        (doc) => doc.data().role === "owner",
      );

      const userEmail = user.emailAddresses[0].emailAddress;

      if (owners.some((owner) => owner.data().userId === userEmail)) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }, [userInRoom, user]);

  return isOwner;
}
