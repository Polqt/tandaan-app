"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useOwner from "@/lib/useOwner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import InviteUser from "../user/invite-user";
import ManageUsers from "../user/manage-users";
import Avatars from "../avatars";
import Editor from "./editor";
import DeleteDocument from "./delete-document";


export default function Document({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const [update, startTransition] = useTransition();
  const [data] = useDocumentData(doc(db, "documents", id));
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />

          <Button disabled={update} type="submit">
            {update ? "Updating..." : "Update"}
          </Button>

          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
              <p>i own this document</p>
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
