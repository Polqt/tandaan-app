"use client";

import { Sparkles } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useDocument, useUpdateDocument } from "@/hooks/useDocument";
import useOwner from "@/lib/useOwner";
import Avatars from "../avatars";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import InviteUser from "../user/invite-user";
import ManageUsers from "../user/manage-users";
import CollaborationReplay from "./collaboration-replay";
import Editor from "./editor";
import { DocumentProps } from "@/types/documents";

export default function Document({ id }: DocumentProps) {
  const [input, setInput] = useState("");
  const { data } = useDocument(id);
  const { isPending, mutate: updateDocument } = useUpdateDocument();
  const isOwner = useOwner();

  useEffect(() => {
    if (data?.title) {
      setInput(data.title);
    }
  }, [data?.title]);

  const savedTitle = data?.title?.trim() ?? "";
  const nextTitle = input.trim();
  const hasTitleChange = useMemo(
    () => Boolean(nextTitle) && nextTitle !== savedTitle,
    [nextTitle, savedTitle],
  );

  function handleUpdateTitle(event: FormEvent) {
    event.preventDefault();

    if (!hasTitleChange) {
      return;
    }

    updateDocument({
      data: { title: nextTitle },
      id,
    });
  }

  return (
    <main className="min-h-screen bg-[#fbfbfa]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-5 pb-10 pt-8 lg:px-10">
        <header className="space-y-6">
          <div className="space-y-4">
            <form
              className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
              onSubmit={handleUpdateTitle}
            >
              <div className="min-w-0 flex-1">
                <Input
                  className="h-auto border-none bg-transparent px-0 text-4xl font-semibold tracking-tight text-stone-950 shadow-none focus-visible:ring-0"
                  onChange={(event) => setInput(event.target.value)}
                  value={input}
                />
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
                  Draft in real time, keep the full editing history, and turn a
                  working note into a clean replay when you need to present the
                  story behind the work.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isOwner && (
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                    Owner
                  </span>
                )}
                <Button
                  className="rounded-full px-4"
                  disabled={!hasTitleChange || isPending}
                  type="submit"
                  variant="outline"
                >
                  {isPending ? "Saving..." : "Save title"}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4 border-y border-[#ebe9e6] py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <ManageUsers />
              <InviteUser />
              <CollaborationReplay />
            </div>
            <Avatars />
          </div>
        </header>

        <Editor />
      </div>
    </main>
  );
}
