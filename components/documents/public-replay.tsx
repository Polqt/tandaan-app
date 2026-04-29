"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { buildReplayShareUrl } from "@/lib/docs/replay-formatters";
import type { ReplayTimeline, Version } from "@/types/version";
import ReplayViewer from "./replay-viewer";

type PublicReplayProps = {
  shareId: string;
  timeline: ReplayTimeline;
};

export default function PublicReplay({ shareId, timeline }: PublicReplayProps) {
  const searchParams = useSearchParams();

  const copyShareLink = useCallback(
    async (version: Version) => {
      try {
        await navigator.clipboard.writeText(
          buildReplayShareUrl(shareId, version.id, window.location.origin),
        );
        toast.success("Replay share link copied.");
      } catch (error) {
        console.error("Error copying shared replay link:", error);
        toast.error("Could not copy replay share link.");
      }
    },
    [shareId],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 lg:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Portfolio Replay
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {timeline.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Shared timeline view for showcasing how this note evolved over time.
        </p>
      </div>

      <ReplayViewer
        initialVersionId={searchParams.get("version")}
        onCopyShareLink={copyShareLink}
        profilesByUserId={timeline.profilesByUserId}
        title={timeline.title}
        versions={timeline.versions}
      />
    </div>
  );
}
