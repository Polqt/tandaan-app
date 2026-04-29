"use client";

import { useOthers, useRoom, useSelf } from "@liveblocks/react/suspense";
import { Code2, History } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { buildReplayShareUrl } from "@/lib/docs/replay-formatters";
import { captureAnalyticsEvent } from "@/lib/telemetry/analytics";
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

export default function CollaborationReplay({
  isOwner = false,
}: {
  isOwner?: boolean;
}) {
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
          buildReplayShareUrl(shareId, version.id, window.location.origin),
        );
        captureAnalyticsEvent("replay_share_link_copied", {
          room_id: room.id,
          version_id: version.id,
        });
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

    captureAnalyticsEvent("replay_opened", {
      is_owner: isOwner,
      room_id: room.id,
    });
    void loadReplayTimeline();
  }, [isOpen, isOwner, loadReplayTimeline, room.id]);

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
        <Button
          className="h-8 rounded-lg bg-transparent px-3 text-xs font-medium text-es-primary hover:bg-[#eeede8] hover:text-es-ink"
          size="sm"
          variant="ghost"
        >
          <History className="mr-1.5 h-3.5 w-3.5" />
          Replay
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto border-l border-[#ebe9e6] bg-[#fbfbfa] px-0 sm:max-w-[1040px]">
        <SheetHeader className="border-b border-[#ebe9e6] px-6 pb-5 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <SheetTitle className="text-2xl font-semibold text-stone-950">
                Collaboration Replay
              </SheetTitle>
              <SheetDescription className="mt-1 max-w-2xl text-sm leading-7 text-stone-500">
                Review each saved checkpoint, annotate chapters, and share a
                public replay link.
              </SheetDescription>
            </div>
            {timeline?.shareId && (
              <Button
                className="shrink-0 rounded-full"
                onClick={() => {
                  const code = `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/replay/${timeline.shareId}/embed" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`;
                  navigator.clipboard.writeText(code);
                  captureAnalyticsEvent("replay_embed_copied", {
                    room_id: room.id,
                  });
                  toast.success("Embed code copied to clipboard.");
                }}
                size="sm"
                variant="outline"
              >
                <Code2 className="mr-1.5 h-4 w-4" />
                Copy embed
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="px-6 py-6">
          <ReplayViewer
            documentId={room.id}
            initialVersionId={searchParams.get("version")}
            isLoading={isLoading}
            isOwner={isOwner}
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
