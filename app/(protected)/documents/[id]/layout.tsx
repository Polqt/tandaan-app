import type React from "react";
import RoomProvider from "@/components/providers/room-provider";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<unknown>;
}) {
  const { id } = (await params) as { id: string };
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
