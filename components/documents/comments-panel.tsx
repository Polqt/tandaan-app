"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Thread, Composer } from "@liveblocks/react-ui";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";

export default function CommentsPanel({ roomId }: { roomId: string }) {
  const { threads } = useThreads();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {threads.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center mt-8">
            No comments yet. Select text and add a comment to start.
          </p>
        ) : (
          threads.map((thread) => (
            <Thread key={thread.id} thread={thread} className="mb-4" />
          ))
        )}
      </div>

      <div className="border-t p-4">
        <Composer className="w-full" />
      </div>
    </div>
  );
}