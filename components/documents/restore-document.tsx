import React, { useState, useTransition } from "react";
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
import { Button } from "../ui/button";
import { ArchiveRestore } from "lucide-react";
import { restoreDocument } from "@/actions/actions";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export default function RestoreDocument() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRestore = async () => {
    const roomId = pathname.split("/").pop();
    if (!roomId) return;
    startTransition(async () => {
      const { success } = await restoreDocument(roomId);
      if (success) {
        router.replace("/documents/{roomId}");
        toast.success("Document restored successfully");
      } else {
        toast.error("Failed to restore the document");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"ghost"}>
        <DialogTrigger>
          <ArchiveRestore className="w-5 h-5" />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to restore this document?
          </DialogTitle>
          <DialogDescription>
            This will restore the document back to your documents list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            type="button"
            variant={"secondary"}
            onClick={handleRestore}
            disabled={isPending}
          >
            {isPending ? "Restoring..." : "Restore Document"}
          </Button>
        </DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant={"ghost"}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
