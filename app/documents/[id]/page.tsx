"use client";

import Document from "@/components/documents/document";
import RoomProvider from "@/components/providers/room-provider";
import { use } from "react";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <RoomProvider roomId={id}>
        <Document id={id} />
      </RoomProvider>
    </div>
  );
}
