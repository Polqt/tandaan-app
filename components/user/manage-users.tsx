"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { toast } from "sonner";
import { removeUser } from "@/services/users";
import { RoomUser } from "@/types/user";

export default function ManageUsers() {
  const { user } = useUser();
  const isOwner = useOwner();
  const room = useRoom();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [usersInRoom, setUsersInRoom] = useState<RoomUser[]>([]);

  useEffect(() => {
    if (!room.id) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/rooms/${room.id}/users`);

        if (response.ok) {
          const { users } = await response.json();
          console.log("Fetched users in room:", users);
          setUsersInRoom(users);
        }
      } catch (error) {
        console.error("Error fetching users in room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [room.id]);

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      if (!user) return;

      const { success } = await removeUser(room.id, userId);

      if (success) {
        toast.success("User removed from the room successfully");
        // Refresh the users list after removing
        const response = await fetch(`/api/rooms/${room.id}/users`);
        if (response.ok) {
          const { users } = await response.json();
          setUsersInRoom(users);
        }
      } else {
        toast.error("Failed to remove user from the room");
      }
    });
  };

  const currentUserId = user?.id;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"}>
        <DialogTrigger>
          users {loading ? "..." : usersInRoom.length}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate</DialogTitle>
          <DialogDescription>
            What is the email of the user you want to invite?
          </DialogDescription>
        </DialogHeader>

        <hr className="my-2" />

        <div className="flex flex-col space-y-2">
          {loading ? (
            <p className="text-sm text-gray-500">Loading users...</p>
          ) : usersInRoom.length === 0 ? (
            <p className="text-sm text-gray-500">No users found</p>
          ) : (
            usersInRoom.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between">
                <p className="font-light">
                  {doc.userId === currentUserId
                    ? `You (${doc.userId})`
                    : doc.userId}
                </p>

                <div className="flex items-center gap-2">
                  <Button variant={"outline"}>{doc.role}</Button>

                  {isOwner && doc.userId !== currentUserId && (
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(doc.userId)}
                      disabled={isPending}
                      size={"sm"}
                    >
                      {isPending ? "Removing..." : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
