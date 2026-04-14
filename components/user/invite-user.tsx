"use client";

import { UserPlus2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getRoomUsers, inviteUser, searchUsers } from "@/services/users";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

export default function InviteUser({ iconOnly = false }: { iconOnly?: boolean }) {
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
        if ("pending" in result && result.pending) {
          toast.success(`Invite sent to ${email} — they'll get access after signing up.`);
        } else {
          toast.success("User added to document.");
        }
      } else {
        toast.error(result.error ?? "Failed to invite the user");
      }
    });
  };

  const handleInviteEmail = (targetEmail: string) => {
    if (!roomId || !targetEmail) return;
    startTransition(async () => {
      const result = await inviteUser(roomId, targetEmail);
      if (result.success) {
        setIsOpen(false);
        setEmail("");
        if ("pending" in result && result.pending) {
          toast.success(`Invite sent to ${targetEmail} — they'll get access after signing up.`);
        } else {
          toast.success("User added to document.");
        }
      } else {
        toast.error(result.error ?? "Failed to invite the user");
      }
    });
  };

  const getInitials = (name: string) =>
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setEmail("");
      }}
    >
      <Button asChild className="h-8 rounded-lg bg-es-ink px-2.5 text-xs font-medium text-white hover:bg-[#3d4239]" size="sm" variant="default">
        <DialogTrigger>
          <UserPlus2 className={cn("h-3.5 w-3.5", !iconOnly && "mr-1.5")} />
          {!iconOnly && "Invite"}
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
            {!loading && users.length > 0 && (
              <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {users.map((user) => (
                  <button
                    className="flex w-full items-center gap-3 rounded-xl border border-[#ebe9e6] bg-[#fbfbfa] px-3 py-2.5 text-left transition hover:bg-white"
                    key={user.id}
                    onClick={() => setEmail(user.email)}
                    type="button"
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-[#e9e5dd]">
                      <AvatarImage alt={user.fullName || "User"} src={user.image} />
                      <AvatarFallback className="bg-[#efeee9] text-xs font-medium text-[#5f5e5e]">
                        {getInitials(user.fullName || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="truncate text-sm font-medium text-[#2f3430]">
                      {user.fullName || "Unnamed user"}
                    </p>
                  </button>
                ))}
              </div>
            )}
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
