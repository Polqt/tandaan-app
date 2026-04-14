"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { useState } from "react";
import { useRoom } from "@liveblocks/react/suspense";
import { formatVersionTimestamp, describeVersionChange } from "@/lib/version-utils";
import type { ReplayTimeline, Version } from "@/types/version";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("");
}

function ActivitySkeleton() {
  return (
    <div className="space-y-5 py-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-3.5 w-3/4 rounded-full" />
            <Skeleton className="h-2.5 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityItem({
  version,
  index,
  total,
  profilesByUserId,
}: {
  version: Version;
  index: number;
  total: number;
  profilesByUserId: ReplayTimeline["profilesByUserId"];
}) {
  const profile = profilesByUserId[version.userId];
  const name = profile?.name || "Someone";
  const isLast = index === total - 1;

  const { addedBlocks = 0, updatedBlocks = 0, removedBlocks = 0 } =
    version.summary ?? {};

  const parts: string[] = [];
  if (addedBlocks > 0) parts.push(`added ${addedBlocks} block${addedBlocks > 1 ? "s" : ""}`);
  if (updatedBlocks > 0) parts.push(`edited ${updatedBlocks}`);
  if (removedBlocks > 0) parts.push(`removed ${removedBlocks}`);
  const action = parts.length > 0 ? parts.join(", ") : "made changes";

  return (
    <div className="relative flex gap-3 pb-4">
      {!isLast && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-[#ebe9e6]" />
      )}

      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white">
        <AvatarImage src={profile?.avatar} alt={name} />
        <AvatarFallback className="bg-stone-100 text-xs font-medium text-stone-600">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm text-stone-800">
          <span className="font-semibold">{name}</span>{" "}
          <span className="text-stone-500">{action}</span>
        </p>
        <p className="mt-0.5 text-xs text-stone-400">
          {formatVersionTimestamp(version.timeStamp)}
        </p>
        {version.chapterLabel && (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#f7f6f3] px-2.5 py-0.5 text-[11px] font-medium text-stone-600">
            {version.chapterLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  const room = useRoom();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<ReplayTimeline>({
    enabled: open,
    queryKey: ["activity", room.id],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${room.id}/versions`);
      if (!res.ok) throw new Error("Failed to load activity");
      return res.json() as Promise<ReplayTimeline>;
    },
    staleTime: 30_000,
  });

  const versions = [...(data?.versions ?? [])].reverse();
  const profilesByUserId = data?.profilesByUserId ?? {};

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-8 rounded-lg bg-transparent px-3 text-xs font-medium text-es-primary hover:bg-[#eeede8] hover:text-es-ink" size="sm" variant="ghost">
          <Activity className="mr-1.5 h-3.5 w-3.5" />
          Activity
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col border-l border-[#ebe9e6] bg-[#fbfbfa] p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-[#ebe9e6] px-6 pb-4 pt-6">
          <SheetTitle className="text-lg font-semibold text-stone-950">
            Activity
          </SheetTitle>
          <SheetDescription className="text-sm text-stone-500">
            All edits saved to this document, newest first.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading && <ActivitySkeleton />}

          {!isLoading && versions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                <Activity className="h-5 w-5 text-stone-400" />
              </div>
              <p className="text-sm font-medium text-stone-700">No activity yet</p>
              <p className="mt-1 text-xs text-stone-400">
                Start editing to see the log here.
              </p>
            </div>
          )}

          {!isLoading && versions.length > 0 && (
            <div>
              {versions.map((version, i) => (
                <ActivityItem
                  key={version.id}
                  index={i}
                  profilesByUserId={profilesByUserId}
                  total={versions.length}
                  version={version}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
