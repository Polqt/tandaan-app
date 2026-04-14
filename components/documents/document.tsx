"use client";

import Link from "next/link";
import { useDocument } from "@/hooks/useDocument";
import type { DocumentProps } from "@/types/documents";
import Avatars from "../avatars";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import InviteUser from "../user/invite-user";
import ManageUsers from "../user/manage-users";
import ActivityFeed from "./activity-feed";
import CollaborationReplay from "./collaboration-replay";
import CommentsPanel from "./comments-panel";
import DeleteDocument from "./delete-document";
import Editor from "./editor";

export default function Document({ id }: DocumentProps) {
  const { data } = useDocument(id);
  const isOwner = data?.role === "owner";
  const title = data?.title?.trim() || "Untitled";

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Document toolbar */}
      <div className="sticky top-0 z-10 border-b border-[#e6e9e4]/80 bg-[#faf9f6]/90 backdrop-blur-xl">
        <div className="px-4 py-2 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Breadcrumb>
                <BreadcrumbList className="text-[13px]">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-es-muted hover:text-es-soft-ink">
                      <Link href="/documents">Workspace</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-es-muted hover:text-es-soft-ink">
                      <Link href="/documents">Documents</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="max-w-[140px] truncate font-medium text-es-ink md:max-w-[220px]">
                      {title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center rounded-2xl bg-white/70 px-4 py-1.5 shadow-[0_12px_28px_rgba(47,52,48,0.11)] backdrop-blur-sm">
              <Avatars />
              <ManageUsers />
              <div className="mx-2.5 h-6 w-px bg-[#ddd8cf]" />
              <div className="flex items-center gap-1.5">
                <ActivityFeed />
                <CollaborationReplay isOwner={isOwner} />
                <CommentsPanel iconOnly />
                <InviteUser iconOnly />
                <DeleteDocument />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document body */}
      <div className="w-full px-4 pb-16 pt-5 md:px-6">
        {/* Editor area — open field with minimal spacing */}
        <div className="pt-2">
          <Editor />
        </div>
      </div>
    </main>
  );
}
