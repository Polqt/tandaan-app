"use client";

import { FormEvent, useEffect, useState } from "react";
import useOwner from "@/lib/useOwner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ManageUsers from "../user/manage-users";
import Avatars from "../avatars";
import Editor from "./editor";
import { useDocument, useUpdateDocument } from "@/hooks/useDocument";

export default function Document({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const { data } = useDocument(id);
  const { mutate: updateDocument, isPending } = useUpdateDocument();
  const isOwner = useOwner();

  useEffect(() => {
    if (data?.title) {
      setInput(data.title);
    }
  }, [data?.title]);

  const updateTitle = async (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      updateDocument({
        id,
        data: { title: input.trim() },
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />

          <Button disabled={isPending} type="submit">
            {isPending ? "Updating..." : "Update"}
          </Button>

          {isOwner && (
            <>
              <p>I own this document</p>
            </>
          )}
        </form>
      </div>

      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        <ManageUsers />
        <Avatars />
      </div>

      <hr className="pb-10" />
      <Editor />
    </div>
  );
}
