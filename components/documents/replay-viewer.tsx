"use client";

import { Bookmark, BookmarkCheck, Copy, Pause, Play, SkipBack, SkipForward, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
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
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

const PLAYBACK_INTERVAL_MS = 2200;

type ReplayViewerProps = {
  documentId?: string;
  emptyStateMessage?: string;
  initialVersionId?: string | null;
  isLoading?: boolean;
  isOwner?: boolean;
  onCopyShareLink?: (version: Version) => void | Promise<void>;
  onVersionLabelChange?: (versionId: string, label: string) => void;
  participantNames?: string[];
  profilesByUserId: ReplayProfilesByUserId;
  title?: string;
  versions: Version[];
};

function getProfileName(profilesByUserId: ReplayProfilesByUserId, userId: string) {
  return profilesByUserId[userId]?.name || "Unknown collaborator";
}

function getInitials(name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) return "?";
  return trimmedName
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("");
}

function ChapterLabelEditor({
  documentId,
  version,
  onSave,
}: {
  documentId: string;
  version: Version;
  onSave: (versionId: string, label: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(version.chapterLabel ?? "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `/api/documents/${documentId}/versions/${version.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterLabel: value }),
        },
      );
      if (!res.ok) throw new Error();
      onSave(version.id, value);
      setEditing(false);
      toast.success(value ? "Chapter label saved." : "Chapter label removed.");
    } catch {
      toast.error("Could not save chapter label.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          className="h-7 rounded-full border-stone-200 px-3 text-xs"
          maxLength={80}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder="e.g. First draft"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          className="h-7 rounded-full px-3 text-xs"
          disabled={saving}
          onClick={save}
          size="sm"
        >
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => setEditing(false)}
          size="sm"
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <button
      className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700"
      onClick={() => setEditing(true)}
      type="button"
    >
      {version.chapterLabel ? (
        <>
          <BookmarkCheck className="h-3.5 w-3.5 text-coral" />
          <span className="font-medium text-stone-700">{version.chapterLabel}</span>
          <span className="text-stone-400">· edit</span>
        </>
      ) : (
        <>
          <Bookmark className="h-3.5 w-3.5" />
          Add chapter label
        </>
      )}
    </button>
  );
}

export default function ReplayViewer({
  documentId,
  emptyStateMessage = "No snapshots yet. Start editing to generate replay points.",
  initialVersionId,
  isLoading = false,
  isOwner = false,
  onCopyShareLink,
  onVersionLabelChange,
  participantNames = [],
  profilesByUserId,
  title,
  versions: initialVersions,
}: ReplayViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  // Local label overrides so UI updates instantly after save
  const [labelOverrides, setLabelOverrides] = useState<Record<string, string>>({});

  const versions = useMemo(
    () =>
      initialVersions.map((v) =>
        labelOverrides[v.id] !== undefined
          ? { ...v, chapterLabel: labelOverrides[v.id] || undefined }
          : v,
      ),
    [initialVersions, labelOverrides],
  );

  const contributors = useMemo(
    () =>
      Array.from(
        new Set(versions.map((v) => getProfileName(profilesByUserId, v.userId))),
      ),
    [profilesByUserId, versions],
  );

  const selectedVersion = versions[selectedVersionIndex];
  const hasVersions = versions.length > 0;
  const isAtStart = selectedVersionIndex === 0;
  const isAtEnd = selectedVersionIndex >= Math.max(versions.length - 1, 0);

  const goToPreviousVersion = useCallback(() => {
    setSelectedVersionIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToNextVersion = useCallback(() => {
    setSelectedVersionIndex((i) => Math.min(i + 1, Math.max(versions.length - 1, 0)));
  }, [versions.length]);

  const togglePlayback = useCallback(() => {
    if (versions.length <= 1) return;
    setIsPlaying((v) => !v);
  }, [versions.length]);

  useEffect(() => {
    setSelectedVersionIndex(getInitialReplayIndex(versions, initialVersionId));
    setIsPlaying(false);
  }, [initialVersionId, versions]);

  useEffect(() => {
    if (!isPlaying || versions.length <= 1) return;
    const interval = setInterval(() => {
      setSelectedVersionIndex((i) => {
        if (i >= versions.length - 1) { setIsPlaying(false); return i; }
        return i + 1;
      });
    }, PLAYBACK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isPlaying, versions.length]);

  const handleLabelSave = (versionId: string, label: string) => {
    setLabelOverrides((prev) => ({ ...prev, [versionId]: label }));
    onVersionLabelChange?.(versionId, label);
  };

  const chapterCount = versions.filter((v) => v.chapterLabel).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <div className="rounded-3xl border border-[#ebe9e6] bg-white p-6">
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
                {chapterCount > 0 && (
                  <p className="flex items-center gap-1.5">
                    <BookmarkCheck className="h-3.5 w-3.5 text-coral" />
                    {chapterCount} chapter{chapterCount > 1 ? "s" : ""} marked
                  </p>
                )}
                {participantNames.length > 0 && (
                  <p>Live now: {participantNames.join(", ")}</p>
                )}
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
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
          <div className="rounded-3xl border border-[#ebe9e6] bg-white px-6 py-10 text-sm text-stone-500">
            Loading timeline...
          </div>
        )}

        {!isLoading && !selectedVersion && (
          <div className="rounded-3xl border border-dashed border-[#dcd8d2] bg-white px-6 py-10 text-sm text-stone-500">
            {emptyStateMessage}
          </div>
        )}

        {!isLoading && selectedVersion && (
          <div className="rounded-3xl border border-[#ebe9e6] bg-white p-6">
            <div className="flex flex-col gap-4 border-b border-[#f1efeb] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage
                    alt={getProfileName(profilesByUserId, selectedVersion.userId)}
                    src={profilesByUserId[selectedVersion.userId]?.avatar}
                  />
                  <AvatarFallback className="bg-stone-100 text-stone-700">
                    {getInitials(getProfileName(profilesByUserId, selectedVersion.userId))}
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

              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                  Snapshot {selectedVersionIndex + 1} of {versions.length}
                </span>
                {isOwner && documentId && (
                  <ChapterLabelEditor
                    documentId={documentId}
                    version={selectedVersion}
                    onSave={handleLabelSave}
                  />
                )}
                {!isOwner && selectedVersion.chapterLabel && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                    <BookmarkCheck className="h-3.5 w-3.5 text-coral" />
                    {selectedVersion.chapterLabel}
                  </span>
                )}
              </div>
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

                {/* AI narrative summary */}
                {selectedVersion.aiSummary && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      <Sparkles className="h-3 w-3" />
                      AI summary
                    </p>
                    <p className="text-sm leading-6 text-slate-700">
                      {selectedVersion.aiSummary}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-[#f7f6f3] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                  Snapshot preview
                </p>
                <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap text-sm leading-7 text-stone-700">
                  {extractPreviewText(selectedVersion.content)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <aside className="rounded-3xl border border-[#ebe9e6] bg-white">
        <div className="border-b border-[#ebe9e6] px-5 py-4">
          <p className="text-sm font-medium text-stone-900">Timeline</p>
          <p className="text-sm text-stone-500">Oldest to newest snapshots</p>
        </div>

        <ScrollArea className="h-152">
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
                  {version.chapterLabel && (
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-coral">
                      <BookmarkCheck className="h-3 w-3" />
                      {version.chapterLabel}
                    </p>
                  )}
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
