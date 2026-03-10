"use client";

import { Copy, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  describeVersionChange,
  extractPreviewText,
  formatVersionTimestamp,
  getInitialReplayIndex,
  summarizeVersionChange,
} from "@/lib/version-utils";
import type { ReplayProfilesByUserId, Version } from "@/types/version";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const PLAYBACK_INTERVAL_MS = 2200;

type ReplayViewerProps = {
  emptyStateMessage?: string;
  initialVersionId?: string | null;
  isLoading?: boolean;
  onCopyShareLink?: (version: Version) => void | Promise<void>;
  participantNames?: string[];
  profilesByUserId: ReplayProfilesByUserId;
  title?: string;
  versions: Version[];
};

function getProfileName(
  profilesByUserId: ReplayProfilesByUserId,
  userId: string,
) {
  return profilesByUserId[userId]?.name || "Unknown collaborator";
}

function getInitials(name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return "?";
  }

  return trimmedName
    .split(" ")
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() || "")
    .join("");
}

export default function ReplayViewer({
  emptyStateMessage = "No snapshots yet. Start editing to generate replay points.",
  initialVersionId,
  isLoading = false,
  onCopyShareLink,
  participantNames = [],
  profilesByUserId,
  title,
  versions,
}: ReplayViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  const contributors = useMemo(
    () =>
      Array.from(
        new Set(
          versions.map((version) =>
            getProfileName(profilesByUserId, version.userId),
          ),
        ),
      ),
    [profilesByUserId, versions],
  );

  const selectedVersion = versions[selectedVersionIndex];
  const hasVersions = versions.length > 0;
  const isAtStart = selectedVersionIndex === 0;
  const isAtEnd = selectedVersionIndex >= Math.max(versions.length - 1, 0);

  const goToPreviousVersion = useCallback(() => {
    setSelectedVersionIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }, []);

  const goToNextVersion = useCallback(() => {
    setSelectedVersionIndex((currentIndex) =>
      Math.min(currentIndex + 1, Math.max(versions.length - 1, 0)),
    );
  }, [versions.length]);

  const togglePlayback = useCallback(() => {
    if (versions.length <= 1) {
      return;
    }

    setIsPlaying((currentValue) => !currentValue);
  }, [versions.length]);

  useEffect(() => {
    setSelectedVersionIndex(getInitialReplayIndex(versions, initialVersionId));
    setIsPlaying(false);
  }, [initialVersionId, versions]);

  useEffect(() => {
    if (!isPlaying || versions.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedVersionIndex((currentIndex) => {
        if (currentIndex >= versions.length - 1) {
          setIsPlaying(false);
          return currentIndex;
        }

        return currentIndex + 1;
      });
    }, PLAYBACK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPlaying, versions.length]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-[#ebe9e6] bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                Replay overview
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
                {title || "Untitled Document"}
              </h2>
              <div className="space-y-1 text-sm text-stone-500">
                <p>
                  Contributors:{" "}
                  {contributors.length > 0
                    ? contributors.join(", ")
                    : "No saved contributors yet"}
                </p>
                <p>
                  Live now:{" "}
                  {participantNames.length > 0
                    ? participantNames.join(", ")
                    : "No active participants in this view"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="rounded-full"
                disabled={!hasVersions || isAtStart}
                onClick={goToPreviousVersion}
                size="sm"
                variant="outline"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                className="rounded-full"
                disabled={versions.length <= 1}
                onClick={togglePlayback}
                size="sm"
                variant="outline"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                className="rounded-full"
                disabled={!hasVersions || isAtEnd}
                onClick={goToNextVersion}
                size="sm"
                variant="outline"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              {onCopyShareLink && selectedVersion && (
                <Button
                  className="rounded-full"
                  onClick={() => onCopyShareLink(selectedVersion)}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="h-4 w-4" />
                  Copy link
                </Button>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-[24px] border border-[#ebe9e6] bg-white px-6 py-10 text-sm text-stone-500">
            Loading timeline...
          </div>
        )}

        {!isLoading && !selectedVersion && (
          <div className="rounded-[24px] border border-dashed border-[#dcd8d2] bg-white px-6 py-10 text-sm text-stone-500">
            {emptyStateMessage}
          </div>
        )}

        {!isLoading && selectedVersion && (
          <div className="rounded-[24px] border border-[#ebe9e6] bg-white p-6">
            <div className="flex flex-col gap-5 border-b border-[#f1efeb] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage
                    alt={getProfileName(
                      profilesByUserId,
                      selectedVersion.userId,
                    )}
                    src={profilesByUserId[selectedVersion.userId]?.avatar}
                  />
                  <AvatarFallback className="bg-stone-100 text-stone-700">
                    {getInitials(
                      getProfileName(profilesByUserId, selectedVersion.userId),
                    )}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {getProfileName(profilesByUserId, selectedVersion.userId)}
                  </p>
                  <p className="text-sm text-stone-500">
                    {formatVersionTimestamp(selectedVersion.timeStamp)}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                Snapshot {selectedVersionIndex + 1} of {versions.length}
              </span>
            </div>

            <div className="grid gap-4 pt-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                    Change summary
                  </p>
                  <p className="mt-2 text-base font-medium text-stone-900">
                    {summarizeVersionChange(selectedVersion.summary)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">
                    {describeVersionChange(selectedVersion.summary)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f7f6f3] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                  Snapshot preview
                </p>
                <pre className="mt-3 max-h-[24rem] overflow-auto whitespace-pre-wrap text-sm leading-7 text-stone-700">
                  {extractPreviewText(selectedVersion.content)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <aside className="rounded-[24px] border border-[#ebe9e6] bg-white">
        <div className="border-b border-[#ebe9e6] px-5 py-4">
          <p className="text-sm font-medium text-stone-900">Timeline</p>
          <p className="text-sm text-stone-500">Oldest to newest snapshots</p>
        </div>

        <ScrollArea className="h-[38rem]">
          <div className="space-y-2 p-3">
            {versions.map((version, index) => {
              const isSelected = index === selectedVersionIndex;

              return (
                <button
                  className={cn(
                    "w-full rounded-2xl border px-4 py-4 text-left transition-colors",
                    isSelected
                      ? "border-stone-900 bg-stone-50"
                      : "border-[#ebe9e6] hover:bg-[#faf9f7]",
                  )}
                  key={version.id}
                  onClick={() => setSelectedVersionIndex(index)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-stone-900">
                      {getProfileName(profilesByUserId, version.userId)}
                    </p>
                    <span className="text-xs text-stone-400">#{index + 1}</span>
                  </div>
                  <p className="mt-2 text-xs text-stone-500">
                    {formatVersionTimestamp(version.timeStamp)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {describeVersionChange(version.summary)}
                  </p>
                </button>
              );
            })}

            {!isLoading && versions.length === 0 && (
              <p className="rounded-2xl border border-dashed border-[#dcd8d2] px-4 py-5 text-sm text-stone-500">
                {emptyStateMessage}
              </p>
            )}
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
