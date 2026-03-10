"use client";

import { useOthers, useRoom, useSelf } from "@liveblocks/react/suspense";
import { History } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ReplayTimeline, Version } from "@/types/version";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ReplayViewer from "./replay-viewer";

function buildReplayUrl(shareId: string, versionId: string) {
  const url = new URL(`/replay/${shareId}`, window.location.origin);
  url.searchParams.set("version", versionId);
  return url.toString();
}

export default function CollaborationReplay() {
  const room = useRoom();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<ReplayTimeline | null>(null);
  const hasAutoOpenedFromLink = useRef(false);

  const selfParticipantName = useSelf(
    (participant) => participant.info?.name || "Anonymous",
  );
  const otherParticipantNames = useOthers((others) =>
    others.map((participant) => participant.info?.name || "Anonymous"),
  );

  const participantNames = useMemo(
    () =>
      Array.from(
        new Set(
          [selfParticipantName, ...otherParticipantNames].filter(Boolean),
        ),
      ),
    [otherParticipantNames, selfParticipantName],
  );

  const loadReplayTimeline = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/documents/${room.id}/versions`);
      if (!response.ok) {
        throw new Error("Failed to load replay timeline");
      }

      const payload = (await response.json()) as ReplayTimeline;
      setTimeline(payload);
    } catch (error) {
      console.error("Error loading collaboration replay:", error);
      toast.error("Unable to load replay timeline.");
    } finally {
      setIsLoading(false);
    }
  }, [room.id]);

  const copyShareLink = useCallback(
    async (version: Version) => {
      try {
        let shareId = timeline?.shareId;

        if (!shareId) {
          const response = await fetch(
            `/api/documents/${room.id}/replay-share`,
            {
              method: "POST",
            },
          );

          if (!response.ok) {
            throw new Error("Failed to create share link");
          }

          const payload = (await response.json()) as { shareId: string };
          shareId = payload.shareId;

          setTimeline((currentTimeline) =>
            currentTimeline ? { ...currentTimeline, shareId } : currentTimeline,
          );
        }

        await navigator.clipboard.writeText(
          buildReplayUrl(shareId, version.id),
        );
        toast.success("Replay share link copied.");
      } catch (error) {
        console.error("Error copying replay share link:", error);
        toast.error("Could not copy replay share link.");
      }
    },
    [room.id, timeline?.shareId],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void loadReplayTimeline();
  }, [isOpen, loadReplayTimeline]);

  useEffect(() => {
    if (searchParams.get("replay") !== "1" || hasAutoOpenedFromLink.current) {
      return;
    }

    hasAutoOpenedFromLink.current = true;
    setIsOpen(true);
  }, [searchParams]);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full" size="sm" variant="outline">
          <History className="h-4 w-4" />
          Replay
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto border-l border-[#ebe9e6] bg-[#fbfbfa] px-0 sm:max-w-[1040px]">
        <SheetHeader className="border-b border-[#ebe9e6] px-6 pb-5 pt-6">
          <SheetTitle className="text-2xl font-semibold text-stone-950">
            Collaboration Replay
          </SheetTitle>
          <SheetDescription className="max-w-2xl text-sm leading-7 text-stone-500">
            Review each saved checkpoint, inspect the change summary, and copy a
            public replay link when the note is ready to share.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-6">
          <ReplayViewer
            initialVersionId={searchParams.get("version")}
            isLoading={isLoading}
            onCopyShareLink={copyShareLink}
            participantNames={participantNames}
            profilesByUserId={timeline?.profilesByUserId || {}}
            title={timeline?.title}
            versions={timeline?.versions || []}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
