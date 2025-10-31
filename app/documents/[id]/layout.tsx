import RoomProvider from "@/components/room-provider";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  auth.protect();

  const { id } = await params;
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}
