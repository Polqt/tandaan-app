"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function NewDocument() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      toast.success("New document created!");
      router.push(`/documents/${docId}`);
    });
  };

  return (
    <Button
      onClick={handleCreateNewDocument}
      disabled={isPending}
      className="w-full justify-start"
      variant="ghost"
    >
      <Plus className="w-4 h-4 mr-2" />
      <span className="text-left flex-1">
        {isPending ? "Creating..." : "New Document"}
      </span>
    </Button>
  );
}
