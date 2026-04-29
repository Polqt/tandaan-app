"use client";

import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper,
} from "@liveblocks/react/suspense";
import type React from "react";
import { Spinner } from "../ui/spinner";
import LiveCursorProvider from "./livecursor-provider";
import RoomErrorBoundary from "./room-error-boundary";

export default function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomErrorBoundary>
      <RoomProviderWrapper id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Spinner className="size-5 text-es-primary" />
            </div>
          }
        >
          <LiveCursorProvider>{children}</LiveCursorProvider>
        </ClientSideSuspense>
      </RoomProviderWrapper>
    </RoomErrorBoundary>
  );
}
