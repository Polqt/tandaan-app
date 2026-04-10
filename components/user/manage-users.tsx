"use client";

import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRoomUsers } from "@/hooks/useRoomUsers";
import { removeUser } from "@/services/users";
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
  const room = useRoom();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data, isLoading } = useRoomUsers(isOpen ? room.id : undefined);
  const usersInRoom = data?.users ?? [];

  const isOwner = useMemo(
    () => usersInRoom.some((m) => m.userId === user?.id && m.role === "owner"),
    [user?.id, usersInRoom],
  );

  function handleDelete(userId: string) {
    startTransition(async () => {
      const result = await removeUser(room.id, userId);

      if (!result.success) {
        toast.error(result.error ?? "Failed to remove collaborator.");
        return;
      }

      toast.success("Collaborator removed.");
      queryClient.invalidateQueries({ queryKey: ["room-users", room.id] });
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
                      {isCurrentUser ? "You" : (member.name ?? member.email ?? member.userId)}
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
