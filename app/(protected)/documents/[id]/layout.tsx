import type React from "react";
import RoomProvider from "@/components/providers/room-provider";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
