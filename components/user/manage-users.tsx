"use client";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { Users } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import useOwner from "@/lib/useOwner";
import { removeUser } from "@/services/users";
import type { RoomUser } from "@/types/user";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function ManageUsers() {
  const { user } = useUser();
  const isOwner = useOwner();
  const room = useRoom();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [usersInRoom, setUsersInRoom] = useState<RoomUser[]>([]);

  const loadUsers = useCallback(async () => {
    if (!room.id) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/rooms/${room.id}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch room users");
      }

      const payload = (await response.json()) as { users: RoomUser[] };
      setUsersInRoom(payload.users);
    } catch (error) {
      console.error("Error fetching users in room:", error);
      setUsersInRoom([]);
      toast.error("Unable to load collaborators.");
    } finally {
      setIsLoading(false);
    }
  }, [room.id]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function handleDelete(userId: string) {
    startTransition(async () => {
      const { success } = await removeUser(room.id, userId);

      if (!success) {
        toast.error("Failed to remove collaborator.");
        return;
      }

      toast.success("Collaborator removed.");
      await loadUsers();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" size="sm" variant="outline">
          <Users className="h-4 w-4" />
          People {isLoading ? "..." : usersInRoom.length}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>People with access</DialogTitle>
          <DialogDescription>
            Review who can open this note and remove collaborators when needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-stone-500">Loading collaborators...</p>
          ) : usersInRoom.length === 0 ? (
            <p className="text-sm text-stone-500">No collaborators found.</p>
          ) : (
            usersInRoom.map((member) => {
              const isCurrentUser = member.userId === user?.id;

              return (
                <div
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#ebe9e6] px-4 py-3"
                  key={member.id}
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {isCurrentUser
                        ? "You"
                        : (member.name ?? member.email ?? member.userId)}
                    </p>
                    <p className="text-xs text-stone-500">
                      {member.email || member.userId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-600">
                      {member.role}
                    </span>

                    {isOwner && !isCurrentUser && (
                      <Button
                        disabled={isPending}
                        onClick={() => handleDelete(member.userId)}
                        size="sm"
                        variant="ghost"
                      >
                        {isPending ? "Removing..." : "Remove"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
