"use client";

import { ArchiveRestore } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { captureAnalyticsEvent } from "@/lib/telemetry/analytics";
import { cn } from "@/lib/utils";
import { restoreDocument } from "@/services/actions";
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

export default function RestoreDocument({
  className,
  roomId,
  showLabel = false,
}: {
  className?: string;
  roomId?: string;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const resolvedRoomId = roomId || params.id;

  const handleRestore = async () => {
    if (!resolvedRoomId) return;

    startTransition(async () => {
      const { success } = await restoreDocument(resolvedRoomId);
      if (success) {
        captureAnalyticsEvent("document_restored", {
          room_id: resolvedRoomId,
        });
        router.replace(`/documents/${resolvedRoomId}`);
        toast.success("Document restored successfully");
      } else {
        captureAnalyticsEvent("document_restore_failed", {
          room_id: resolvedRoomId,
        });
        toast.error("Failed to restore the document");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Restore document"
          className={cn(
            showLabel
              ? "h-9 rounded-full px-3 text-xs"
              : "h-8 w-8 rounded-lg text-es-primary hover:bg-[#eeede8]",
            className,
          )}
          size={showLabel ? "sm" : "icon"}
          variant={showLabel ? "default" : "ghost"}
        >
          <ArchiveRestore className="h-3.5 w-3.5" />
          {showLabel ? <span className="ml-1.5">Restore</span> : null}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to restore this document?
          </DialogTitle>
          <DialogDescription>
            This will move the note back into your active documents list and
            reopen collaboration for it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            disabled={isPending}
            onClick={handleRestore}
            type="button"
            variant="secondary"
          >
            {isPending ? "Restoring..." : "Restore Document"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
