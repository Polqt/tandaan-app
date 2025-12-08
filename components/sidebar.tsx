"use client";

import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useMemo } from "react";
import SidebarOption from "./sidebar-option";
import { Button } from "./ui/button";
import SearchDialog from "./search-dialog";
import NewDocument from "./documents/new-document";
import Link from "next/link";
import { useRooms } from "@/hooks/useRooms";

interface RoomDocument {
  id: string;
  roomId: string;
  createdAt: string;
  role: "owner" | "editor";
  userId: string;
  document?: any;
}

export default function Sidebar() {
  const { data, isLoading, error } = useRooms();

  const groupedData = useMemo(() => {
    if (!data?.rooms || !Array.isArray(data.rooms)) {
      return { owner: [], editor: [] };
    }
    const owner: RoomDocument[] = [];
    const editor: RoomDocument[] = [];

    data.rooms.forEach((doc: any) => {
      const item: RoomDocument = {
        id: doc.roomid || doc.id,
        roomId: doc.roomId || doc.id,
        createdAt: doc.createdAt,
        role: doc.role,
        userId: doc.userId,
        document: doc.document,
      };

      if (item.role === "owner") {
        owner.push(item);
      } else if (item.role === "editor") {
        editor.push(item);
      }
    });

    return { owner, editor };
  }, [data?.rooms]);

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
        {isLoading ? (
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
