"use client";

import { useAuth } from "@clerk/nextjs";
import {
  Clock,
  FileText,
  LayoutGrid,
  List,
  Share2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import NewDocument from "@/components/documents/new-document";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlan } from "@/hooks/auth/use-plan";
import { useRooms } from "@/hooks/docs/use-rooms";
import { FREE_DOC_LIMIT } from "@/types/billing";

function EmptyState() {
  return (
    <div className="rounded-2xl border border-(--color-es-line) bg-white px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#f1f0ec]">
        <FileText className="text-es-muted" />
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-es-ink">
        No documents yet
      </h2>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-es-muted">
        Create your first document to start capturing your work with a full
        replay timeline.
      </p>
      <div className="mt-6 flex justify-center">
        <NewDocument compact />
      </div>
    </div>
  );
}

function PlanBar({ count }: { count: number }) {
  const { plan, isLoading } = usePlan();
  if (isLoading || plan === "pro") return null;

  const pct = Math.min((count / FREE_DOC_LIMIT) * 100, 100);

  return (
    <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5">
      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-amber-800">
          <span>
            {count} of {FREE_DOC_LIMIT} free documents
          </span>
          <Link
            href="/billing"
            className="underline underline-offset-2 hover:text-amber-900"
          >
            Upgrade to Pro
          </Link>
        </div>
        <div className="h-1.5 w-full rounded-full bg-amber-200/90">
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
  const sortedRooms = [...rooms].sort((a, b) => {
    const aTime = new Date(a.document?.updatedAt ?? a.createdAt ?? 0).getTime();
    const bTime = new Date(b.document?.updatedAt ?? b.createdAt ?? 0).getTime();
    return bTime - aTime;
  });
  const featured = sortedRooms[0];
  const secondary = sortedRooms[1];
  const gridRooms = sortedRooms.slice(2);

  return (
    <div className="mx-auto w-full max-w-[1150px] px-6 py-8 lg:px-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbPage className="text-es-muted">
                  Workspace
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-es-ink">
                  Documents
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-2 font-display text-[3rem] font-semibold leading-[0.98] tracking-[-0.045em] text-es-ink">
            All Documents
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md border-(--color-es-line) bg-white text-es-soft-ink"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md text-es-muted hover:bg-[#efeee9] hover:text-es-ink"
          >
            <List className="h-4 w-4" />
          </Button>
          <NewDocument compact />
        </div>
      </div>

      {!isLoading && <PlanBar count={rooms.length} />}

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Skeleton className="h-[248px] rounded-2xl" />
          <Skeleton className="h-[248px] rounded-2xl" />
          <Skeleton className="h-[220px] rounded-2xl" />
          <Skeleton className="h-[220px] rounded-2xl" />
          <Skeleton className="h-[220px] rounded-2xl" />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {featured && (
              <Link
                href={`/documents/${featured.id}`}
                className="group rounded-2xl border border-[#ece9e1] bg-[#f4f5f2] px-6 py-5 transition hover:border-[#d8d3c8] hover:bg-[#f0f1ec]"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-full border border-[#d8d3c8] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-es-soft-ink">
                    In progress
                  </span>
                  <span className="text-xs text-es-muted">
                    {featured.document?.updatedAt
                      ? `Edited ${new Date(
                          featured.document.updatedAt,
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}`
                      : "Recently updated"}
                  </span>
                </div>
                <h2 className="max-w-2xl text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.03em] text-es-ink">
                  {featured.document?.title ?? "Untitled"}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-es-soft-ink">
                  Continue writing and refining this draft with replay-ready
                  edits and collaborative comments.
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-es-muted">
                    <span className="rounded-full bg-white px-2 py-0.5 font-medium capitalize">
                      {featured.role}
                    </span>
                    {featured.document?.replayShareId && (
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        Shared
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#474c46]">
                    Open Sketch -&gt;
                  </span>
                </div>
              </Link>
            )}

            <div className="rounded-2xl border border-[#ece9e1] bg-[#f1f2ef] p-5">
              {secondary ? (
                <Link
                  href={`/documents/${secondary.id}`}
                  className="group block h-full"
                >
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#6a6b66]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-[1.9rem] font-semibold leading-[1.07] tracking-[-0.03em] text-es-ink">
                    {secondary.document?.title ?? "Untitled"}
                  </h3>
                  <p className="mt-2 text-sm text-[#6e6a63]">
                    {secondary.document?.updatedAt
                      ? `Last modified ${new Date(
                          secondary.document.updatedAt,
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}`
                      : "Recently updated"}
                  </p>
                </Link>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#6a6b66]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-es-muted">
                    No secondary document yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {gridRooms.map((room) => {
              const title = room.document?.title ?? "Untitled";
              const updatedAt = room.document?.updatedAt;

              return (
                <Link
                  key={room.id}
                  href={`/documents/${room.id}`}
                  className="group rounded-xl border border-[#ece9e1] bg-white p-4 transition hover:border-[#d9d4c8] hover:bg-[#fbfaf8]"
                >
                  <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-[#efefec] text-[#b0aea8]">
                    <FileText className="h-10 w-10" />
                  </div>
                  <p className="line-clamp-2 min-h-[40px] text-base font-semibold leading-5 text-es-ink">
                    {title}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-es-muted">
                    <span className="capitalize">{room.role}</span>
                    {updatedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(updatedAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            <div className="flex min-h-[248px] items-center justify-center rounded-xl border border-dashed border-[#d3d0c7] bg-es-canvas p-4 text-center">
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#efeee9] text-[#7f7c74]">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f6b63]">
                  Create New Sketch
                </p>
                <div className="flex justify-center">
                  <NewDocument compact />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
