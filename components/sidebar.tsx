"use client";

import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { FileText, MenuIcon, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { usePlan } from "@/hooks/usePlan";
import type { DocumentData } from "@/types/documents";
import NewDocument from "./documents/new-document";
import SearchDialog from "./search-dialog";
import SidebarOption from "./sidebar-option";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

interface RoomDocument {
  createdAt: string;
  document?: Partial<DocumentData>;
  id: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

function createGroupedRooms(rooms: RoomDocument[]) {
  return rooms.reduce(
    (groups, room) => {
      if (room.role === "owner") groups.owner.push(room);
      else groups.editor.push(room);
      return groups;
    },
    { editor: [] as RoomDocument[], owner: [] as RoomDocument[] },
  );
}

function SidebarSection({ rooms, title }: { rooms: RoomDocument[]; title: string }) {
  if (rooms.length === 0) return null;

  return (
    <section className="space-y-0.5">
      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        {title}
      </p>
      {rooms.map((room) => (
        <SidebarOption
          href={`/documents/${room.id}`}
          id={room.id}
          key={room.id}
          title={room.document?.title ?? "Untitled"}
        />
      ))}
    </section>
  );
}

function PlanBadge() {
  const { plan } = usePlan();
  if (plan === "pro") return null;

  return (
    <Link
      href="/pricing"
      className="mx-3 mb-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 transition hover:bg-amber-100"
    >
      <span className="flex-1 leading-5">
        <strong className="font-semibold">Free plan</strong> · 3 docs max
      </span>
      <span className="rounded-full bg-amber-800 px-2 py-0.5 text-[10px] font-semibold text-amber-50">
        Upgrade
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();
  const isReplayPage = pathname.startsWith("/replay/");
  const { data, error, isLoading } = useRooms(userId, Boolean(userId) && !isReplayPage);

  if (!isLoaded || !userId || isReplayPage) return null;

  const rooms = (data?.rooms ?? []).map<RoomDocument>((room) => ({
    createdAt: typeof room.createdAt === "string" ? room.createdAt : "",
    document:
      room.document && typeof room.document === "object"
        ? (room.document as Partial<DocumentData>)
        : undefined,
    id: room.roomid || room.id,
    role: room.role,
    roomId: room.roomId || room.id,
    userId: room.userId,
  }));

  const groupedRooms = createGroupedRooms(rooms);

  const content = (
    <div className="flex h-full flex-col select-none">
      {/* Workspace header */}
      <div className="flex items-center gap-2 px-3 pb-2 pt-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-white">
          <FileText className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 truncate text-sm font-semibold text-stone-800">
          My Workspace
        </span>
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: "w-6 h-6" } }}
        />
      </div>

      {/* Actions */}
      <div className="space-y-0.5 px-2 pb-2 pt-1">
        <SearchDialog />
        <NewDocument />
      </div>

      <div className="mx-3 border-t border-[#ebe9e6]" />

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="space-y-1 px-2 pt-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-lg bg-stone-200/60" />
            ))}
          </div>
        ) : error ? (
          <p className="px-3 pt-3 text-xs text-red-500">Unable to load notes.</p>
        ) : rooms.length === 0 ? (
          <div className="px-2 pt-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
              <Plus className="h-5 w-5 text-stone-400" />
            </div>
            <p className="mt-2 text-xs text-stone-400">No documents yet</p>
          </div>
        ) : (
          <>
            <SidebarSection rooms={groupedRooms.owner} title="My Notes" />
            <SidebarSection rooms={groupedRooms.editor} title="Shared With Me" />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <PlanBadge />
        <div className="border-t border-[#ebe9e6] px-2 py-2">
          <Button
            asChild
            variant="ghost"
            className="h-8 w-full justify-start rounded-lg px-2 text-xs text-stone-500 hover:text-stone-800"
          >
            <Link href="/pricing">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Settings & Billing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="min-h-full border-r border-[#ebe9e6] bg-[#f7f6f3]">
      {/* Mobile: sheet trigger */}
      <div className="p-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64 p-0" side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full bg-[#f7f6f3]">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop */}
      <div className="hidden h-full w-64 md:block">{content}</div>
    </aside>
  );
}
