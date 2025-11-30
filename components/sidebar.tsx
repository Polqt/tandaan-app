"use client";

import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import SidebarOption from "./sidebar-option";
import { Button } from "./ui/button";
import SearchDialog from "./search-dialog";
import NewDocument from "./documents/new-document";
import Link from "next/link";

interface RoomDocument {
  id: string;
  roomId: string;
  createdAt: string;
  role: "owner" | "editor";
  userId: string;
  document?: any;
}

export default function Sidebar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/rooms");

        if (!res.ok) {
          throw new Error(`Failed to fetch rooms: ${res.statusText}`);
        }

        const json = await res.json();
        const rooms = json.rooms ?? [];

        const owner: RoomDocument[] = [];
        const editor: RoomDocument[] = [];

        rooms.forEach((doc: any) => {
          const item: RoomDocument = {
            id: doc.roomId || doc.id,
            roomId: doc.roomId || doc.id,
            userId: doc.userId,
            role: doc.role,
            createdAt: doc.createdAt || new Date().toISOString(),
            document: doc.document,
          };

          if (item.role === "owner") {
            owner.push(item);
          } else if (item.role === "editor") {
            editor.push(item);
          }
        });

        setGroupedData({ owner, editor });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user?.id]);

  const menuOptions = (
    <div className="flex flex-col h-full">
      <div className="p-2 mb-2">
        <div className="relative">
          <SearchDialog />
        </div>
      </div>

      <div className="px-2 mb-4">
        <NewDocument />
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-6 border-t border-gray-600 pt-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">
            <p className="text-sm">Error loading documents</p>
          </div>
        ) : groupedData.owner.length === 0 &&
          groupedData.editor.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No documents yet</p>
          </div>
        ) : (
          <>
            {groupedData.owner.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase tracking-wider mb-2 px-2">
                  <Link href="/documents">My Documents</Link>
                </h2>
                <div className="space-y-1">
                  {groupedData.owner.map((doc) => (
                    <SidebarOption
                      title={doc.document?.title ?? "Untitled Document"}
                      key={doc.id}
                      id={doc.id}
                      href={`/documents/${doc.id}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedData.editor.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  Shared With Me
                </h2>
                <div className="space-y-1">
                  {groupedData.editor.map((doc) => (
                    <SidebarOption
                      title={doc.document?.title ?? "Untitled Document"}
                      key={doc.id}
                      id={doc.id}
                      href={`/documents/${doc.id}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-600 dark:border-gray-800">
      <div className="md:hidden p-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full">{menuOptions}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block h-full w-64">{menuOptions}</div>
    </div>
  );
}
