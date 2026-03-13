"use client";

import { useAuth } from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
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
      if (room.role === "owner") {
        groups.owner.push(room);
      } else {
        groups.editor.push(room);
      }

      return groups;
    },
    { editor: [] as RoomDocument[], owner: [] as RoomDocument[] },
  );
}

function SidebarSection({
  rooms,
  title,
}: {
  rooms: RoomDocument[];
  title: string;
}) {
  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <p className="px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
        {title}
      </p>
      <div className="space-y-1">
        {rooms.map((room) => (
          <SidebarOption
            href={`/documents/${room.id}`}
            id={room.id}
            key={room.id}
            title={room.document?.title ?? "Untitled Document"}
          />
        ))}
      </div>
    </section>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();
  const isReplayPage = pathname.startsWith("/replay/");
  const { data, error, isLoading } = useRooms(
    userId,
    Boolean(userId) && !isReplayPage,
  );

  if (!isLoaded || !userId || isReplayPage) {
    return null;
  }

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
    <div className="flex h-full flex-col bg-[#f7f6f3]">
      <div className="border-b border-[#ebe9e6] px-3 pb-4 pt-5">
        <div className="mb-4 px-3">
          <Link
            className="text-[11px] uppercase tracking-[0.2em] text-stone-400"
            href="/documents"
          >
            Workspace
          </Link>
        </div>

        <div className="space-y-2">
          <SearchDialog />
          <NewDocument />
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {isLoading ? (
          <p className="px-3 text-sm text-stone-500">Loading notes...</p>
        ) : error ? (
          <p className="px-3 text-sm text-red-600">Unable to load notes.</p>
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dedbd5] bg-white/70 px-4 py-5 text-sm text-stone-500">
            Create your first note to start the workspace.
          </div>
        ) : (
          <>
            <SidebarSection rooms={groupedRooms.owner} title="My Documents" />
            <SidebarSection
              rooms={groupedRooms.editor}
              title="Shared With Me"
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <aside className="min-h-full border-r border-[#ebe9e6] bg-[#f7f6f3]">
      <div className="p-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-72 p-0" side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden h-full w-72 md:block">{content}</div>
    </aside>
  );
}
