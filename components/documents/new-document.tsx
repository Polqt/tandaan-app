"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/services/actions";
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
      className="h-11 w-full justify-start rounded-xl border border-transparent px-3 text-stone-700 hover:border-[#e8e6e1] hover:bg-white"
      disabled={isPending}
      onClick={handleCreateNewDocument}
      variant="ghost"
    >
      <Plus className="mr-2 h-4 w-4" />
      <span className="flex-1 text-left">
        {isPending ? "Creating..." : "New Document"}
      </span>
    </Button>
  );
}
