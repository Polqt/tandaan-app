"use client";

import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Clock3,
  CreditCard,
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
import { usePlan } from "@/hooks/auth/use-plan";
import { useRooms } from "@/hooks/docs/use-rooms";
import type { DocumentData } from "@/types/documents";
import NewDocument from "../documents/new-document";
import SearchDialog from "../search/search-dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import SidebarOption from "./sidebar-option";

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

function SidebarSection({
  rooms,
  title,
}: {
  rooms: RoomDocument[];
  title: string;
}) {
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
        className="flex items-center gap-2 rounded-2xl border border-[#e1ddd2] bg-white/90 px-3.5 py-3 text-xs text-es-primary transition hover:bg-[#fcfbf8]"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-es-ink text-white">
          <svg
            aria-hidden="true"
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-es-ink">Pro plan active</p>
          <p className="mt-0.5 text-[11px] text-es-muted">
            Unlimited docs and replay sharing.
          </p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-es-muted">
          Manage
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/billing"
      className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800 transition hover:bg-amber-100"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Free plan</p>
        <p className="mt-0.5 text-[11px] leading-5 text-amber-700">
          3 docs max before upgrade.
        </p>
      </div>
      <span className="rounded-full bg-amber-800 px-2.5 py-1 text-[10px] font-semibold text-amber-50">
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
  const { data, error, isLoading } = useRooms(
    userId,
    Boolean(userId) && !isReplayPage,
  );

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
  const usage = Math.min(
    Math.round(((ownerCount + sharedCount) / 20) * 100),
    100,
  );

  const content = (
    <div className="flex h-full flex-col select-none border-r border-(--color-es-line) bg-[#f5f4ef]">
      <div className="px-4 pb-2 pt-4 md:pt-5">
        <h2 className="font-display text-[1.75rem] font-semibold leading-[0.95] tracking-[-0.04em] text-es-ink md:text-[2rem]">
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
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5"
              >
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-3 flex-1 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="px-2 pt-3 text-xs text-red-500">
            Unable to load notes.
          </p>
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
                <Link href="/documents/trash">
                  <Trash2 className="mr-2 size-3.5" />
                  Trash
                </Link>
              </Button>
            </div>
            <SidebarSection rooms={groupedRooms.owner} title="My Notes" />
            <SidebarSection
              rooms={groupedRooms.editor}
              title="Shared With Me"
            />
          </div>
        )}
      </ScrollArea>

      <div className="mt-auto border-t border-[#e6e2d8] px-3 pb-3 pt-3">
        <PlanBadge />

        <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_112px] md:grid-cols-1">
          <div className="rounded-2xl border border-(--color-es-line) bg-white/80 px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-es-muted">
              <span>Storage used</span>
              <span>{usage}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#e7e3d9]">
              <div
                className="h-1.5 rounded-full bg-es-primary"
                style={{ width: `${usage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-es-muted">
              <span>{ownerCount} owned docs</span>
              <span>{sharedCount} shared</span>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            className="h-auto rounded-2xl border border-[#e2ddd2] bg-white/75 px-3 py-3 text-left text-xs text-es-muted hover:bg-es-faint hover:text-es-ink"
          >
            <Link href="/billing">
              <div className="flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                <div>
                  <p className="font-medium text-es-ink">Billing</p>
                  <p className="mt-0.5 text-[11px] text-es-muted">
                    Plan and invoices
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#e2ddd2] bg-white/85 px-3 py-3 backdrop-blur-sm">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-9 h-9" } }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-es-ink">
              {user?.fullName ||
                user?.username ||
                user?.firstName ||
                "Your profile"}
            </p>
            <p className="truncate text-[11px] text-es-muted">
              {user?.primaryEmailAddress?.emailAddress || "Personal workspace"}
            </p>
          </div>
          <Button
            asChild
            className="h-8 rounded-full px-3 text-[11px]"
            size="sm"
            variant="ghost"
          >
            <Link href="/billing">
              <Settings className="mr-1.5 h-3 w-3" />
              Manage
            </Link>
          </Button>
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
          <SheetContent className="w-[min(22rem,100vw)] p-0" side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full bg-[#f4f4f0]">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden h-full w-[276px] md:block lg:w-[300px]">
        {content}
      </div>
    </aside>
  );
}
