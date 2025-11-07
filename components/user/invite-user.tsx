"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { getAllUsers, getRoomUsers, inviteUser } from "@/actions/users";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { User } from "@/types/user";
import { useUser } from "@clerk/nextjs";

export default function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useUser();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathname.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUser(roomId, email);
      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("user invited successfully");
      } else {
        toast.error("failed to invite the user");
      }
    });
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const roomId = pathname.split("/").pop();
      if (!roomId) return;

      const [allUsers,existingUsers] = await Promise.all([
        getAllUsers(),
        getRoomUsers(roomId),
      ])
      
    } catch (error) {
      toast.error("failed to load users");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"}>
        <DialogTrigger>invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>invite a user to collaborate</DialogTitle>
          <DialogDescription>
            what is the email of the user you want to invite?
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
            {isPending ? "inviting..." : "invite user"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
