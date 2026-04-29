"use client";

import { UserPlus2 } from "lucide-react";
import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { captureAnalyticsEvent } from "@/lib/telemetry/analytics";
import { getDisplayInitials } from "@/lib/users/display";
import { cn } from "@/lib/utils";
import { getRoomUsers, inviteUser, searchUsers } from "@/services/users";
import type { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

export default function InviteUser({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [roomUserIds, setRoomUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const roomId = params.id;

  useEffect(() => {
    if (!isOpen || !roomId) return;
    getRoomUsers(roomId).then(setRoomUserIds).catch(console.error);
  }, [isOpen, roomId]);

  useEffect(() => {
    if (!isOpen || !roomId) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchUsers(email);
        setUsers(results.filter((user) => !roomUserIds.includes(user.id)));
      } catch {
        toast.error("Failed to search users");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [email, isOpen, roomId, roomUserIds]);

  const finishInvite = (targetEmail: string) => {
    if (!roomId || !targetEmail) return;

    startTransition(async () => {
      const result = await inviteUser(roomId, targetEmail);
      if (result.success) {
        captureAnalyticsEvent("document_invited_user", {
          mode: "pending" in result && result.pending ? "pending" : "direct",
          room_id: roomId,
        });
        setIsOpen(false);
        setEmail("");
        if ("pending" in result && result.pending) {
          toast.success(
            `Invite sent to ${targetEmail} - they'll get access after signing up.`,
          );
        } else {
          toast.success("User added to document.");
        }
      } else {
        captureAnalyticsEvent("document_invite_failed", {
          room_id: roomId,
        });
        toast.error(result.error ?? "Failed to invite the user");
      }
    });
  };

  const handleInvite = async (event: FormEvent) => {
    event.preventDefault();
    finishInvite(email);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setEmail("");
      }}
    >
      <Button
        aria-label={iconOnly ? "Invite user" : undefined}
        asChild
        className="h-8 rounded-lg bg-es-ink px-2.5 text-xs font-medium text-white hover:bg-[#3d4239]"
        size="sm"
        variant="default"
      >
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

        <form className="flex gap-2" onSubmit={handleInvite}>
          <Input
            className="w-full"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email"
            type="email"
            value={email}
          />
          <Button disabled={!email || isPending} type="submit">
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>

        {isOpen ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Searching..."
                : `${users.length} user${users.length === 1 ? "" : "s"} found`}
            </p>

            {!loading && users.length > 0 ? (
              <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {users.map((user) => (
                  <button
                    className="flex w-full items-center gap-3 rounded-xl border border-[#ebe9e6] bg-[#fbfbfa] px-3 py-2.5 text-left transition hover:bg-white"
                    key={user.id}
                    onClick={() => finishInvite(user.email)}
                    type="button"
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-[#e9e5dd]">
                      <AvatarImage
                        alt={user.fullName || "User"}
                        src={user.image}
                      />
                      <AvatarFallback className="bg-[#efeee9] text-xs font-medium text-es-primary">
                        {getDisplayInitials(user.fullName || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-es-ink">
                        {user.fullName || "Unnamed user"}
                      </p>
                      <p className="truncate text-xs text-es-muted">
                        {user.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            {roomUserIds.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {roomUserIds.length} user{roomUserIds.length === 1 ? "" : "s"}{" "}
                already in this document.
              </p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
