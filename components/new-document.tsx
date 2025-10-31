"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";

export default function NewDocument() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/documents/${docId}`);
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "creating..." : "new document"}
    </Button>
  );
}
