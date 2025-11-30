"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import useOwner from "@/lib/useOwner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ManageUsers from "../user/manage-users";
import Avatars from "../avatars";
import Editor from "./editor";
import { DocumentData } from "@/types/documents";

export default function Document({ id }: { id: string }) {
  const [input, setInput] = useState("");
  const [update, startTransition] = useTransition();
  const [, setLoading] = useState(true);
  const [, setData] = useState<DocumentData | null>(null);
  const isOwner = useOwner();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${id}`);
        if (response.ok) {
          const json = await response.json();
          setInput(json.document);
          setInput(json?.document.title || "Untitled Document");
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const updateTitle = async (e: FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      startTransition(async () => {
        try {
          const response = await fetch(`/api/documents/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: input.trim() }),
          });

          if (response.ok) {
            setData((prev) =>
              prev
                ? {
                    ...prev,
                    title: input,
                  }
                : null,
            );
          }
        } catch (error) {
          console.error("Error updating document title:", error);
        }
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
