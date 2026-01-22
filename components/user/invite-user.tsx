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
import { getAllUsers, getRoomUsers, inviteUser } from "@/services/users";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { User } from "@/types/user";
import { useUser } from "@clerk/nextjs";
import { Users2 } from "lucide-react";

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

      const allUsersList = await getAllUsers();
      const existingUsers = await getRoomUsers(roomId);

      // Filter out users that are already in the room
      const availableUsers = (allUsersList || []).filter(
        (user: User) => !existingUsers.includes(user.id)
      );

      setUsers(availableUsers);
      setRoomUsers(existingUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"ghost"} className="hover:text-blue-800">
        <DialogTrigger>
          <Users2 className="w-5 h-5" />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate</DialogTitle>
          <DialogDescription>
            What is the email of the user you want to invite?
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
            {isPending ? "Inviting..." : "Invite User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
