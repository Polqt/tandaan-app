"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Spinner } from "../ui/spinner";

export default function CommentsPanel() {
  const { threads } = useThreads();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="rounded-full"
          size={"sm"}
          onClick={() => setIsOpen(true)}
          variant={"outline"}
        >
          <MessageSquare className="h-4 w-4" />
          Comments
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b border-gray-600">
          <SheetTitle>Comment Panel</SheetTitle>
          <SheetDescription>
            View and add comments to the document.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-180px)] pr-4">
          <div className="space-y-4">
            {threads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-8">
                No comments yet. <br /> Select text and add a comment to start.
              </p>
            ) : (
              threads.map((thread) => (
                <Thread key={thread.id} thread={thread} className="thread" />
              ))
            )}
            <Composer className="composer" />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
