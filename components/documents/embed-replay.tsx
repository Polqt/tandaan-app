"use client";

import { BookmarkCheck, ExternalLink, Play, SkipBack, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  describeVersionChange,
  extractPreviewText,
  formatVersionTimestamp,
} from "@/lib/version-utils";
import type { ReplayTimeline } from "@/types/version";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const PLAYBACK_INTERVAL_MS = 2200;

type EmbedReplayProps = {
  shareId: string;
  timeline: ReplayTimeline;
};

function getProfileName(profilesByUserId: ReplayTimeline["profilesByUserId"], userId: string) {
  return profilesByUserId[userId]?.name || "Anonymous";
}

function getInitials(name: string) {
  return name.trim().split(" ").slice(0, 2).map((s) => s[0]?.toUpperCase() || "").join("");
}

export default function EmbedReplay({ shareId, timeline }: EmbedReplayProps) {
  const { versions, profilesByUserId, title } = timeline;
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const version = versions[index];
  const isAtStart = index === 0;
  const isAtEnd = index >= versions.length - 1;

  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  const next = useCallback(() => setIndex((i) => Math.min(i + 1, versions.length - 1)), [versions.length]);

  const togglePlay = useCallback(() => {
    if (versions.length > 1) setIsPlaying((p) => !p);
  }, [versions.length]);

  useEffect(() => {
    if (!isPlaying || versions.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= versions.length - 1) { setIsPlaying(false); return i; }
        return i + 1;
      });
    }, PLAYBACK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying, versions.length]);

  const chapters = useMemo(
    () => versions.filter((v) => v.chapterLabel),
    [versions],
  );

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/replay/${shareId}`;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-sans text-stone-900">
      {/* Embed header */}
      <div className="flex items-center justify-between border-b border-[#ebe9e6] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">{title}</p>
          <p className="text-xs text-stone-400">{versions.length} snapshots</p>
        </div>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#ebe9e6] px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
        >
          <ExternalLink className="h-3 w-3" />
          Open full replay
        </a>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chapter list — only shown if chapters exist */}
        {chapters.length > 0 && (
          <aside className="hidden w-44 shrink-0 overflow-y-auto border-r border-[#ebe9e6] p-2 md:block">
            <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              Chapters
            </p>
            {chapters.map((v) => {
              const chapterIndex = versions.indexOf(v);
              return (
                <button
                  key={v.id}
                  className={`w-full rounded-xl px-2 py-2.5 text-left text-xs transition-colors hover:bg-stone-50 ${chapterIndex === index ? "font-semibold text-stone-900" : "text-stone-500"}`}
                  onClick={() => setIndex(chapterIndex)}
                  type="button"
                >
                  <span className="flex items-center gap-1.5">
                    <BookmarkCheck className="h-3 w-3 shrink-0 text-coral" />
                    {v.chapterLabel}
                  </span>
                </button>
              );
            })}
          </aside>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Snapshot content */}
          <div className="flex-1 overflow-y-auto p-4">
            {version ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profilesByUserId[version.userId]?.avatar} />
                      <AvatarFallback className="bg-stone-100 text-xs text-stone-700">
                        {getInitials(getProfileName(profilesByUserId, version.userId))}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">
                        {getProfileName(profilesByUserId, version.userId)}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {formatVersionTimestamp(version.timeStamp)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {index + 1} / {versions.length}
                  </span>
                </div>

                {version.chapterLabel && (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-coral">
                    <BookmarkCheck className="h-3.5 w-3.5" />
                    {version.chapterLabel}
                  </p>
                )}

                {version.aiSummary && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs leading-6 text-slate-600">{version.aiSummary}</p>
                  </div>
                )}

                {!version.aiSummary && (
                  <p className="text-sm text-stone-500">
                    {describeVersionChange(version.summary)}
                  </p>
                )}

                <div className="rounded-xl bg-[#f7f6f3] p-4">
                  <pre className="max-h-[calc(100vh-20rem)] overflow-auto whitespace-pre-wrap text-sm leading-7 text-stone-700">
                    {extractPreviewText(version.content)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-stone-400">No snapshots yet.</p>
            )}
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between border-t border-[#ebe9e6] px-4 py-2">
            <div className="flex items-center gap-1.5">
              <Button
                className="h-8 w-8 rounded-full p-0"
                disabled={isAtStart}
                onClick={prev}
                size="sm"
                variant="outline"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </Button>
              <Button
                className="h-8 w-8 rounded-full p-0"
                disabled={versions.length <= 1}
                onClick={togglePlay}
                size="sm"
                variant="outline"
              >
                <Play className={`h-3.5 w-3.5 ${isPlaying ? "opacity-50" : ""}`} />
              </Button>
              <Button
                className="h-8 w-8 rounded-full p-0"
                disabled={isAtEnd}
                onClick={next}
                size="sm"
                variant="outline"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </Button>
            </div>
            <a
              href="https://tandaan.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold tracking-tight text-stone-400 hover:text-stone-600"
            >
              Made with Tandaan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
