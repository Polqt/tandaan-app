"use client";

import { Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { captureAnalyticsEvent } from "@/lib/telemetry/analytics";
import { cn } from "@/lib/utils";
import { deleteDocument } from "@/services/actions";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function DeleteDocument({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const roomId = params.id;
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await deleteDocument(roomId);
      if (success) {
        captureAnalyticsEvent("document_deleted", {
          room_id: roomId,
        });
        router.replace("/documents/trash");
        toast.success("Document moved to trash");
      } else {
        captureAnalyticsEvent("document_delete_failed", {
          room_id: roomId,
        });
        toast.error("Failed to move the document to trash");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label="Delete document"
        asChild
        className={cn(
          showLabel
            ? "h-9 rounded-full px-3 text-xs text-red-700 hover:bg-red-50 hover:text-red-700"
            : "h-8 w-8 rounded-lg text-es-muted hover:bg-[#eeede8] hover:text-red-600",
          className,
        )}
        size={showLabel ? "sm" : "icon"}
        variant="ghost"
      >
        <DialogTrigger>
          <Trash2Icon className="h-3.5 w-3.5" />
          {showLabel ? <span className="ml-1.5">Move to trash</span> : null}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will delete in 30 days and remove
            access for all users.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant={"destructive"}
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
