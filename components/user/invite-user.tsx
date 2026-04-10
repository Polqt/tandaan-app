"use client";

import { UserPlus2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getRoomUsers, inviteUser, searchUsers } from "@/services/users";
import type { User } from "@/types/user";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [roomUserIds, setRoomUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const roomId = pathname.split("/").pop();

  // Load current room members once when the modal opens
  useEffect(() => {
    if (!isOpen || !roomId) return;
    getRoomUsers(roomId).then(setRoomUserIds).catch(console.error);
  }, [isOpen, roomId]);

  // Search users as the email input changes (debounced via useEffect)
  useEffect(() => {
    if (!isOpen || !roomId) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchUsers(email);
        setUsers(results.filter((u) => !roomUserIds.includes(u.id)));
      } catch {
        toast.error("Failed to search users");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [email, isOpen, roomId, roomUserIds]);

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!roomId) return;

    startTransition(async () => {
      const result = await inviteUser(roomId, email);
      if (result.success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User invited successfully");
      } else {
        toast.error(result.error ?? "Failed to invite the user");
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setEmail("");
      }}
    >
      <Button asChild className="rounded-full" size="sm" variant="outline">
        <DialogTrigger>
          <UserPlus2 className="h-4 w-4" />
          Invite
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate</DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to invite.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="flex gap-2">
          <Input
            type="email"
            placeholder="email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>

        {isOpen && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Searching..."
                : `${users.length} user${users.length === 1 ? "" : "s"} found`}
            </p>
            {roomUserIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {roomUserIds.length} user{roomUserIds.length === 1 ? "" : "s"} already in this document.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
