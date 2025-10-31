"use client";

import RoomProvider from "@/components/room-provider";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default function DocLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  auth.protect();

  return (
    <RoomProvider
      roomId={id}
    >
      {children}
    </RoomProvider>
  );
}
