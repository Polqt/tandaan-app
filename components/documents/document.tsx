"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useDocument, useUpdateDocument } from "@/hooks/useDocument";
import type { DocumentProps } from "@/types/documents";
import Avatars from "../avatars";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import InviteUser from "../user/invite-user";
import ManageUsers from "../user/manage-users";
import CollaborationReplay from "./collaboration-replay";
import Editor from "./editor";

export default function Document({ id }: DocumentProps) {
  const [input, setInput] = useState("");
  const { data } = useDocument(id);
  const { isPending, mutate: updateDocument } = useUpdateDocument();
  const isOwner = data?.role === "owner";

  useEffect(() => {
    if (data?.title) setInput(data.title);
  }, [data?.title]);

  const savedTitle = data?.title?.trim() ?? "";
  const nextTitle = input.trim();
  const hasTitleChange = useMemo(
    () => Boolean(nextTitle) && nextTitle !== savedTitle,
    [nextTitle, savedTitle],
  );

  function handleUpdateTitle(event: FormEvent) {
    event.preventDefault();
    if (!hasTitleChange) return;
    updateDocument({ data: { title: nextTitle }, id });
  }

  return (
    <main className="min-h-screen bg-[#fbfbfa]">
      {/* Document toolbar */}
      <div className="sticky top-0 z-10 border-b border-[#ebe9e6] bg-[#fbfbfa]/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-6 py-2.5">
          <div className="flex items-center gap-2">
            <ManageUsers />
            <InviteUser />
            <CollaborationReplay />
          </div>
          <div className="flex items-center gap-3">
            <Avatars />
            {isOwner && (
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-[11px] font-medium text-stone-500">
                Owner
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Document body */}
      <div className="mx-auto w-full max-w-[900px] px-6 pb-20 pt-12">
        {/* Title */}
        <form onSubmit={handleUpdateTitle} className="group mb-2">
          <div className="flex items-start gap-3">
            <Input
              className="h-auto flex-1 border-none bg-transparent px-0 text-[2.25rem] font-bold leading-tight tracking-tight text-stone-950 shadow-none placeholder:text-stone-300 focus-visible:ring-0"
              onChange={(e) => setInput(e.target.value)}
              placeholder="Untitled"
              value={input}
            />
            {hasTitleChange && (
              <Button
                className="mt-1 rounded-full px-3 py-1.5 text-xs font-medium"
                disabled={isPending}
                size="sm"
                type="submit"
                variant="outline"
              >
                {isPending ? "Saving…" : "Save"}
              </Button>
            )}
          </div>
        </form>

        {/* Editor area */}
        <div className="mt-6">
          <Editor />
        </div>
      </div>
    </main>
  );
}
