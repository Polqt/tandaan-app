"use client";

import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import NewDocument from "./new-document";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useUser } from "@clerk/nextjs";
import { DocumentData, collection } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./sidebar-option";
import { Button } from "./ui/button";
import SearchDialog from "./search-dialog";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
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
  const [data, loading, error] = useCollection(
    user && collection(db, "users", user.id, "rooms"),
  );

  useEffect(() => {
    if (!data) return;

    const docs = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;

        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }
        return acc;
      },
      { owner: [], editor: [] },
    );
    setGroupedData(docs);
  }, [data]);

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

      <div className="flex-1 overflow-y-auto px-2 space-y-6">
        {groupedData.owner.length === 0 && groupedData.editor.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">no documentes yet</p>
          </div>
        ) : (
          <>
            {groupedData.owner.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  My Documents
                </h2>
                <div className="space-y-1">
                  {groupedData.owner.map((doc) => (
                    <SidebarOption
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
                  Shared with me
                </h2>
                <div className="space-y-1">
                  {groupedData.editor.map((doc) => (
                    <SidebarOption
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
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="md:hidden p-2">
        <Sheet>
          <SheetTrigger>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            {" "}
            <SheetTitle>menu</SheetTitle>
            <div className="h-full">{menuOptions}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block h-full w-64">{menuOptions}</div>
    </div>
  );
}
