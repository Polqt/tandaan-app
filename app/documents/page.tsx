"use client";

import { useAuth } from "@clerk/nextjs";
import { Clock3, FileText, Link2, Sparkles } from "lucide-react";
import Link from "next/link";
import NewDocument from "@/components/documents/new-document";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/hooks/useRooms";

export default function DocumentsPage() {
  const { userId } = useAuth();
  const { data, isLoading } = useRooms(userId, Boolean(userId));
  const rooms = data?.rooms || [];

  if (!userId) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="font-display mt-6 text-3xl font-semibold text-slate-950">
            Sign in to open your workspace
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your document dashboard, collaborators, and replay links live behind
            your signed-in workspace.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-2 py-4">
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Workspace
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Keep shipping notes with replay built in.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Draft, collaborate, then turn a working note into a
              presentation-ready replay.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Quick action
              </p>
              <div className="mt-4">
                <NewDocument />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Documents
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {isLoading ? "..." : rooms.length}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Replay ready
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {isLoading ? "..." : rooms.length > 0 ? "Yes" : "Start"}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Docs
          </p>
          <div className="mt-3">
            <Button asChild className="rounded-full" variant="outline">
              <Link href="/docs">
                Read product notes
                <Link2 className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-950">
              Recent documents
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Open a note, collaborate live, then share the replay when it is
              ready.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading documents...</p>
          ) : rooms.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
              No documents yet. Create one from the panel above to start your
              workspace.
            </div>
          ) : (
            rooms.map((room) => (
              <Link
                className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                href={`/documents/${room.id}`}
                key={room.id}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-950">
                      {room.document?.title ?? "Untitled Document"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {room.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  Open workspace
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
