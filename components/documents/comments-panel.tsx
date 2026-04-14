"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
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

function ThreadList() {
  const { threads } = useThreads();

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
          <MessageSquare className="h-5 w-5 text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-700">No comments yet</p>
        <p className="mt-1 text-xs text-stone-400">
          Highlight text in the editor to start a thread.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className="overflow-hidden rounded-2xl border border-[#ebe9e6] bg-white"
        >
          <Thread
            thread={thread}
            className="lb-thread-panel"
          />
        </div>
      ))}
    </div>
  );
}

export default function CommentsPanel({ iconOnly = false }: { iconOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

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
          <Button className="h-8 rounded-lg bg-transparent px-2.5 text-xs font-medium text-[#5f5e5e] hover:bg-[#eeede8] hover:text-[#2f3430]" size="sm" variant="ghost">
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
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="px-4 py-4">
              <ThreadList />
            </div>
          </ScrollArea>

          {/* New thread composer pinned to bottom */}
          <div className="border-t border-[#ebe9e6] bg-white px-4 py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              New thread
            </p>
            <div className="overflow-hidden rounded-2xl border border-[#ebe9e6] bg-[#fbfbfa]">
              <Composer />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
