"use client";

import { Activity, Ellipsis, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDocument } from "@/hooks/docs/use-document";
import type { DocumentProps } from "@/types/documents";
import Avatars from "../collaboration/avatars";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import DocumentTitle from "./document-title";
import Editor from "./editor";

const ActivityFeed = dynamic(() => import("./activity-feed"), {
  loading: () => (
    <Button className="h-8 rounded-lg px-3 text-xs" size="sm" variant="ghost">
      Activity
    </Button>
  ),
  ssr: false,
});

const CollaborationReplay = dynamic(() => import("./collaboration-replay"), {
  loading: () => (
    <Button className="h-8 rounded-lg px-3 text-xs" size="sm" variant="ghost">
      Replay
    </Button>
  ),
  ssr: false,
});

const CommentsPanel = dynamic(() => import("./comments-panel"), {
  loading: () => (
    <Button className="h-8 rounded-lg px-2.5 text-xs" size="sm" variant="ghost">
      Comments
    </Button>
  ),
  ssr: false,
});

const InviteUser = dynamic(() => import("../user/invite-user"), { ssr: false });
const ManageUsers = dynamic(() => import("../user/manage-users"), {
  ssr: false,
});
const DeleteDocument = dynamic(() => import("./delete-document"), {
  ssr: false,
});

function MobileActionSheet({ isOwner }: { isOwner: boolean }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="h-8 rounded-lg px-2.5 text-xs text-es-primary hover:bg-[#eeede8]"
          size="sm"
          variant="ghost"
        >
          <Ellipsis className="h-3.5 w-3.5" />
          <span className="sr-only">More document actions</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-sm border-l border-[#ebe9e6] bg-[#fbfaf7] px-0">
        <SheetHeader className="border-b border-[#ebe9e6] px-5 pb-4 pt-6 text-left">
          <SheetTitle className="text-lg font-semibold text-es-ink">
            Document actions
          </SheetTitle>
          <SheetDescription className="text-sm text-es-muted">
            Keep the canvas clean while still reaching replay, people, and admin
            controls.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-5 py-5">
          <div className="rounded-[1.35rem] border border-[#e7e2d7] bg-white/85 p-4 shadow-[0_10px_30px_rgba(47,52,48,0.05)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-es-muted">
              Active now
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Avatars />
              <p className="text-sm text-es-primary">
                Collaboration is live in this document.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-es-muted">
              Collaborators
            </p>
            <div className="grid gap-2">
              <ManageUsers />
              <InviteUser />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-es-muted">
              Review
            </p>
            <div className="grid gap-2">
              <ActivityFeed />
              <CollaborationReplay isOwner={isOwner} />
              <CommentsPanel />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-es-muted">
              Admin
            </p>
            <DeleteDocument showLabel />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Document({ id }: DocumentProps) {
  const { data } = useDocument(id);
  const isOwner = data?.role === "owner";
  const title = data?.title?.trim() || "Untitled";

  return (
    <main className="workspace-shell min-h-screen bg-es-canvas">
      <div className="relative z-10">
        <div className="sticky top-0 z-20 border-b border-[#e6e9e4]/80 bg-es-canvas/88 backdrop-blur-xl">
          <div className="mx-auto max-w-[1380px] px-4 py-3 md:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <Breadcrumb className="min-w-0">
                  <BreadcrumbList className="min-w-0 flex-nowrap gap-1 overflow-x-auto whitespace-nowrap text-[13px] sm:flex-wrap sm:overflow-visible">
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        asChild
                        className="text-es-muted hover:text-es-soft-ink"
                      >
                        <Link href="/documents">Workspace</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        asChild
                        className="text-es-muted hover:text-es-soft-ink"
                      >
                        <Link href="/documents">Documents</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="min-w-0 flex-1">
                      <div className="min-w-36 max-w-56 md:max-w-[20rem]">
                        <DocumentTitle
                          documentId={id}
                          initialTitle={title}
                          variant="breadcrumb"
                        />
                      </div>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center justify-end gap-2 md:hidden">
                <CommentsPanel iconOnly />
                <CollaborationReplay isOwner={isOwner} />
                <MobileActionSheet isOwner={isOwner} />
              </div>

              <div className="hidden md:flex md:items-center md:justify-end">
                <div className="workspace-panel flex flex-wrap items-center gap-2 rounded-3xl px-3 py-2 sm:px-4 sm:py-2.5">
                  <div className="hidden items-center gap-3 border-r border-[#ddd8cf] pr-4 xl:flex">
                    <div className="min-w-0 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-es-muted">
                        Active now
                      </p>
                      <p className="text-sm text-es-primary">1 collaborator</p>
                    </div>
                    <Avatars />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <ManageUsers />
                    <ActivityFeed />
                    <CollaborationReplay isOwner={isOwner} />
                    <CommentsPanel iconOnly />
                  </div>

                  <div className="h-7 w-px bg-[#ddd8cf]" />

                  <div className="flex items-center gap-1.5">
                    <InviteUser iconOnly />
                    <DeleteDocument />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-es-muted md:hidden">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#e6e1d7] bg-white/80 px-2.5 py-1 text-[10px] text-es-primary">
                <Users className="h-3 w-3" />1 collaborator
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#e6e1d7] bg-white/80 px-2.5 py-1 text-[10px] text-es-primary">
                <Activity className="h-3 w-3" />
                Live
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1380px] px-4 pb-10 pt-4 md:px-6 md:pb-16 md:pt-6">
          <div className="editor-stage">
            <p className="workspace-doodle absolute left-6 top-8 hidden -rotate-10 text-es-muted xl:block">
              shape the thought here
            </p>
            <div className="editor-canvas px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-7">
              <Editor />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
