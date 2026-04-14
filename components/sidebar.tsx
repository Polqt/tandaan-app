"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import {
  Clock3,
  FileText,
  FolderKanban,
  MenuIcon,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { usePlan } from "@/hooks/usePlan";
import { Skeleton } from "./ui/skeleton";
import type { DocumentData } from "@/types/documents";
import NewDocument from "./documents/new-document";
import SearchDialog from "./search-dialog";
import SidebarOption from "./sidebar-option";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
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
    <section className="flex flex-col gap-0.5">
      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-es-muted">
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
  const { plan, isLoading } = usePlan();
  if (isLoading) return null;

  if (plan === "pro") {
    return (
      <Link
        href="/billing"
        className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-[#eeede8] px-3 py-2.5 text-xs text-es-primary transition hover:bg-es-faint"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-es-ink text-white">
          <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
        <span className="flex-1 font-semibold text-es-ink">Pro</span>
        <span className="text-[10px] text-es-muted">Manage</span>
      </Link>
    );
  }

  return (
    <Link
      href="/billing"
      className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 transition hover:bg-amber-100"
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
  const { user } = useUser();
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
  const ownerCount = groupedRooms.owner.length;
  const sharedCount = groupedRooms.editor.length;

  const content = (
    <div className="flex h-full flex-col select-none border-r border-(--color-es-line) bg-[#f5f4ef]">
      <div className="px-4 pb-2 pt-5">
        <h2 className="font-display text-[2.05rem] font-semibold leading-[0.95] tracking-[-0.04em] text-es-ink">
          Tandaan.AI
        </h2>
      </div>

      <div className="flex flex-col gap-1 px-3 pb-2 pt-1">
        <SearchDialog />
        <NewDocument />
      </div>

      <ScrollArea className="flex-1 px-3 pb-2 pt-1">
        {isLoading ? (
          <div className="flex flex-col gap-1 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-3 flex-1 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="px-2 pt-3 text-xs text-red-500">Unable to load notes.</p>
        ) : rooms.length === 0 ? (
          <div className="px-2 pt-6 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-[#eeede8]">
              <Plus className="size-5 text-es-muted" />
            </div>
            <p className="mt-2 text-xs text-es-muted">No documents yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Button
              asChild
              variant="ghost"
              className="mb-1 h-8 justify-start rounded-md px-2 text-xs font-medium text-es-ink hover:bg-[#ecebe7]"
            >
              <Link href="/documents">
                <FolderKanban className="mr-2 size-3.5" />
                All Documents
              </Link>
            </Button>
            <div className="space-y-0.5">
              <Button
                asChild
                variant="ghost"
                className="h-8 justify-start rounded-md px-2 text-xs text-es-muted hover:bg-[#efeee9] hover:text-es-ink"
              >
                <Link href="/documents">
                  <Clock3 className="mr-2 size-3.5" />
                  Recents
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-8 justify-start rounded-md px-2 text-xs text-es-muted hover:bg-[#efeee9] hover:text-es-ink"
              >
                <Link href="/documents">
                  <FileText className="mr-2 size-3.5" />
                  Drafts
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-8 justify-start rounded-md px-2 text-xs text-es-muted hover:bg-[#efeee9] hover:text-es-ink"
              >
                <Link href="/documents">
                  <Users className="mr-2 size-3.5" />
                  Shared
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-8 justify-start rounded-md px-2 text-xs text-es-muted hover:bg-[#efeee9] hover:text-es-ink"
              >
                <Link href="/documents">
                  <Trash2 className="mr-2 size-3.5" />
                  Trash
                </Link>
              </Button>
            </div>
            <SidebarSection rooms={groupedRooms.owner} title="My Notes" />
            <SidebarSection rooms={groupedRooms.editor} title="Shared With Me" />
          </div>
        )}
      </ScrollArea>

      <div className="mt-auto border-t border-[#e6e2d8] px-3 pb-3 pt-3">
        <PlanBadge />
        <div className="mb-2 rounded-lg border border-(--color-es-line) bg-white/75 px-2.5 py-2">
          <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-es-muted">
            <span>Storage used</span>
            <span>
              {Math.min(Math.round(((ownerCount + sharedCount) / 20) * 100), 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#e7e3d9]">
            <div
              className="h-1.5 rounded-full bg-es-primary"
              style={{
                width: `${Math.min(Math.round(((ownerCount + sharedCount) / 20) * 100), 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[10px] text-es-muted">Sketchbook Pro Plan</p>
        </div>
        <div className="pt-1">
          <Button
            asChild
            variant="ghost"
            className="h-8 w-full justify-start rounded-md px-2 text-xs text-es-muted hover:bg-es-faint hover:text-es-ink"
          >
            <Link href="/billing">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Billing
            </Link>
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-es-canvas/80 px-2.5 py-2 backdrop-blur-sm">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-es-ink">
              {user?.fullName || user?.username || user?.firstName || "Your profile"}
            </p>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <aside className="min-h-full bg-[#f5f4ef]">
      <div className="p-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64 p-0" side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full bg-[#f4f4f0]">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden h-full w-[272px] md:block">{content}</div>
    </aside>
  );
}
