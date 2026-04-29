"use client";

import { getMentionsFromCommentBody } from "@liveblocks/client";
import {
  useMarkThreadAsResolved,
  useMarkThreadAsUnresolved,
  useRoom,
  useThreads,
} from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { CheckCheck, MessageSquare, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type ThreadFilter = "open" | "resolved";

function ThreadList({ filter }: { filter: ThreadFilter }) {
  const { threads } = useThreads();
  const markThreadAsResolved = useMarkThreadAsResolved();
  const markThreadAsUnresolved = useMarkThreadAsUnresolved();

  const filteredThreads = useMemo(
    () =>
      threads.filter((thread) =>
        filter === "resolved" ? thread.resolved : !thread.resolved,
      ),
    [filter, threads],
  );

  if (filteredThreads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
          <MessageSquare className="h-5 w-5 text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-700">
          {filter === "resolved"
            ? "No resolved threads yet"
            : "No open comments"}
        </p>
        <p className="mt-1 text-xs text-stone-400">
          {filter === "resolved"
            ? "Resolved discussions will appear here."
            : "Highlight text in the editor to start a thread."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredThreads.map((thread) => (
        <div
          key={thread.id}
          className="overflow-hidden rounded-2xl border border-[#ebe9e6] bg-white"
        >
          <div className="flex items-center justify-between border-b border-[#f1efeb] px-4 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              {thread.resolved ? "Resolved" : "Open thread"}
            </p>
            <Button
              className="h-7 rounded-full px-2.5 text-[11px]"
              onClick={() =>
                thread.resolved
                  ? markThreadAsUnresolved(thread.id)
                  : markThreadAsResolved(thread.id)
              }
              size="sm"
              variant="ghost"
            >
              {thread.resolved ? (
                <RotateCcw className="h-3.5 w-3.5" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              {thread.resolved ? "Reopen" : "Resolve"}
            </Button>
          </div>
          <Thread thread={thread} className="lb-thread-panel" />
        </div>
      ))}
    </div>
  );
}

export default function CommentsPanel({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
  const room = useRoom();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<ThreadFilter>("open");

  const handleComposerSubmit = async ({
    body,
  }: {
    body: Parameters<typeof getMentionsFromCommentBody>[0];
  }) => {
    const mentionedUserIds = Array.from(
      new Set(
        getMentionsFromCommentBody(body)
          .filter((mention) => mention.kind === "user")
          .map((mention) => mention.id),
      ),
    );

    if (mentionedUserIds.length === 0) {
      return;
    }

    await fetch(`/api/documents/${room.id}/mentions`, {
      body: JSON.stringify({ mentionedUserIds }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch((error) => {
      console.warn("Could not record mention notifications:", error);
    });
  };

  return (
    <>
      {/* Push Liveblocks emoji picker above the Sheet overlay */}
      <style>{`
        .lb-emoji-picker,
        [data-radix-popper-content-wrapper]:has(.lb-emoji-picker) {
          z-index: 9999 !important;
        }
        .lb-thread-panel .lb-thread {
          border: none;
          border-radius: 0;
          box-shadow: none;
          padding: 0.75rem 1rem;
        }
        .lb-thread-panel .lb-composer {
          border-top: 1px solid #f1efeb;
          padding: 0.5rem 1rem;
        }
      `}</style>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="h-8 rounded-lg bg-transparent px-2.5 text-xs font-medium text-es-primary hover:bg-[#eeede8] hover:text-es-ink"
            size="sm"
            variant="ghost"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {!iconOnly && <span className="ml-1.5">Comments</span>}
          </Button>
        </SheetTrigger>

        <SheetContent className="flex w-full flex-col border-l border-[#ebe9e6] bg-[#fbfbfa] p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-[#ebe9e6] px-6 pb-4 pt-6">
            <SheetTitle className="text-lg font-semibold text-stone-950">
              Comments
            </SheetTitle>
            <SheetDescription className="text-sm text-stone-500">
              Threads attached to this document.
            </SheetDescription>
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => setFilter("open")}
                size="sm"
                variant={filter === "open" ? "default" : "outline"}
              >
                Open
              </Button>
              <Button
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => setFilter("resolved")}
                size="sm"
                variant={filter === "resolved" ? "default" : "outline"}
              >
                Resolved
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-4 py-4">
              <ThreadList filter={filter} />
            </div>
          </ScrollArea>

          {/* New thread composer pinned to bottom */}
          <div className="border-t border-[#ebe9e6] bg-white px-4 py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              New thread
            </p>
            <div className="overflow-hidden rounded-2xl border border-[#ebe9e6] bg-[#fbfbfa]">
              <Composer onComposerSubmit={handleComposerSubmit} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
