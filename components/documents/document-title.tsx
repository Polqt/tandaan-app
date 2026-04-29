"use client";

import { PenLine } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export default function DocumentTitle({
  documentId,
  initialTitle,
  variant = "display",
}: {
  documentId: string;
  initialTitle: string;
  variant?: "breadcrumb" | "display";
}) {
  const [title, setTitle] = useState(initialTitle);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedTitleRef = useRef(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
    lastSavedTitleRef.current = initialTitle;
  }, [initialTitle]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scheduleSave = (nextTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const normalizedTitle = nextTitle.trim() || "Untitled";
    if (normalizedTitle === lastSavedTitleRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        try {
          const response = await fetch(`/api/documents/${documentId}`, {
            body: JSON.stringify({ title: normalizedTitle }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
          });

          if (!response.ok) {
            throw new Error("Failed to update title");
          }

          lastSavedTitleRef.current = normalizedTitle;
        } catch (error) {
          console.error("Error updating title:", error);
          toast.error("Could not save title.");
        }
      });
    }, 500);
  };

  const isBreadcrumb = variant === "breadcrumb";

  return (
    <label
      className={`group flex min-w-0 items-center ${
        isBreadcrumb ? "gap-2" : "gap-3"
      }`}
    >
      <PenLine
        className={`shrink-0 text-es-muted transition group-focus-within:text-es-primary ${
          isBreadcrumb ? "size-3.5" : "size-4"
        }`}
      />
      <input
        aria-label="Document title"
        className={`min-w-0 flex-1 border-0 bg-transparent text-es-ink outline-none placeholder:text-es-muted ${
          isBreadcrumb
            ? "font-medium leading-none tracking-[-0.02em] text-[13px] md:text-sm"
            : "font-display text-[2rem] font-semibold leading-[0.96] tracking-[-0.05em] md:text-[2.5rem]"
        }`}
        onBlur={() => {
          const normalizedTitle = title.trim() || "Untitled";
          setTitle(normalizedTitle);
          scheduleSave(normalizedTitle);
        }}
        onChange={(event) => {
          const nextTitle = event.target.value;
          setTitle(nextTitle);
          scheduleSave(nextTitle);
        }}
        placeholder="Untitled"
        value={title}
      />
      {isPending ? (
        <span
          className={`workspace-doodle shrink-0 text-es-soft-ink ${
            isBreadcrumb ? "text-[10px]" : "text-[11px]"
          }`}
        >
          saving
        </span>
      ) : null}
    </label>
  );
}
