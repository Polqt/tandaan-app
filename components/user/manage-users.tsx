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
import { Skeleton } from "../ui/skeleton";
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
        <Button className="h-8 rounded-lg bg-transparent px-2.5 text-xs font-medium text-es-primary hover:bg-[#eeede8] hover:text-es-ink" size="sm" variant="ghost">
          <Users className="mr-1.5 h-3.5 w-3.5" />
          People {isLoading ? "…" : usersInRoom.length}
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
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#ebe9e6] px-4 py-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-2/5 rounded-full" />
                    <Skeleton className="h-2.5 w-3/5 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              ))}
            </div>
          ) : usersInRoom.length === 0 ? (
            <p className="text-sm text-es-muted">No collaborators found.</p>
          ) : (
            usersInRoom.map((member) => {
              const isCurrentUser = member.userId === user?.id;

              return (
                <div
                  className="flex items-center justify-between gap-4 rounded-2xl bg-es-surface px-4 py-3"
                  key={member.id}
                >
                  <div>
                    <p className="text-sm font-medium text-es-ink">
                      {isCurrentUser ? "You" : (member.name ?? member.email ?? member.userId)}
                    </p>
                    <p className="text-xs text-es-muted">
                      {member.email || member.userId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-es-primary shadow-[0_1px_2px_rgba(47,52,48,0.06)]">
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
