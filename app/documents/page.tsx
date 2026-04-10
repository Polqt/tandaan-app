"use client";

import { useAuth } from "@clerk/nextjs";
import { Clock, FileText, Share2 } from "lucide-react";
import Link from "next/link";
import NewDocument from "@/components/documents/new-document";
import { useRooms } from "@/hooks/useRooms";
import { usePlan } from "@/hooks/usePlan";
import { FREE_DOC_LIMIT } from "@/types/billing";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-stone-100">
        <FileText className="h-7 w-7 text-stone-400" />
      </div>
      <h2 className="text-base font-semibold text-stone-800">No documents yet</h2>
      <p className="mt-1.5 max-w-xs text-sm text-stone-500">
        Create your first document to start capturing your work with a full replay timeline.
      </p>
      <div className="mt-6">
        <NewDocument />
      </div>
    </div>
  );
}

function PlanBar({ count }: { count: number }) {
  const { plan } = usePlan();
  if (plan === "pro") return null;

  const pct = Math.min((count / FREE_DOC_LIMIT) * 100, 100);

  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs font-medium text-amber-800 mb-1.5">
          <span>{count} of {FREE_DOC_LIMIT} free documents</span>
          <Link href="/pricing" className="underline underline-offset-2 hover:text-amber-900">
            Upgrade to Pro
          </Link>
        </div>
        <div className="h-1.5 w-full rounded-full bg-amber-200">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { userId } = useAuth();
  const { data, isLoading } = useRooms(userId, Boolean(userId));
  const rooms = data?.rooms ?? [];

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      {/* Page heading */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-stone-950">
            All documents
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {isLoading ? "Loading…" : `${rooms.length} document${rooms.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <NewDocument />
      </div>

      {/* Free plan usage bar */}
      {!isLoading && <PlanBar count={rooms.length} />}

      {/* Document list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-1.5">
          {rooms.map((room) => {
            const title = room.document?.title ?? "Untitled";
            const updatedAt = room.document?.updatedAt;
            const hasShare = Boolean(room.document?.replayShareId);

            return (
              <Link
                key={room.id}
                href={`/documents/${room.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3.5 transition-all hover:border-[#ebe9e6] hover:bg-white hover:shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
              >
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 transition-colors group-hover:bg-stone-200 group-hover:text-stone-600">
                  <FileText className="h-4 w-4" />
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3">
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10px] font-medium capitalize text-stone-500">
                      {room.role}
                    </span>
                    {hasShare && (
                      <span className="flex items-center gap-1 text-[11px] text-stone-400">
                        <Share2 className="h-3 w-3" />
                        Shared
                      </span>
                    )}
                  </div>
                </div>

                {/* Updated at */}
                {updatedAt && (
                  <div className="hidden shrink-0 items-center gap-1.5 text-[11px] text-stone-400 sm:flex">
                    <Clock className="h-3 w-3" />
                    {new Date(updatedAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
