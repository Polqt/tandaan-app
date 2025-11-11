"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

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
        <Button variant={"outline"} size={"sm"} onClick={() => setIsOpen(true)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Comments
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comment Panel</SheetTitle>
          <SheetDescription>
            View and add comments to the document.
          </SheetDescription>
          <ScrollArea className="mt-6 space-y-4 h-[calc(110vh-180px)] pr-4">
            <div className="space-y-4">
              {threads.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-8">
                  No comments yet. Select text and add a comment to start.
                </p>
              ) : (
                threads.map((thread) => (
                  <Thread key={thread.id} thread={thread} />
                ))
              )}
              <Composer />
            </div>
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
