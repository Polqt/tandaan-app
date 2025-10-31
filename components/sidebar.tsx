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
import {
  DocumentData,
  collection,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./sidebar-option";

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
    user &&
      collection(db, "users", user.id, "rooms"),
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
    <>
      <NewDocument />

      <div className="flex py-4 flex-col space-y-4 mad:max-w-36">
        {groupedData.owner.length === 0 ? (
          <h2 className="text-slate-500 font-semibold text-sm">
            no documents found
          </h2>
        ) : (
          <>
            <h2 className="text-slate-500 font-semibold text-sm">
              my documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOption
                key={doc.id}
                id={doc.id}
                href={`/documents/${doc.id}`}
              />
            ))}
          </>
        )}
      </div>

      <div>
        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-slate-500 font-semibold text-sm">
              shared with me
            </h2>
            {groupedData.editor.map((doc) => (
              <SidebarOption
                key={doc.id}
                id={doc.id}
                href={`/documents/${doc.id}`}
              />
            ))}
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block">
        {menuOptions}
      </div>
    </div>
  );
}
