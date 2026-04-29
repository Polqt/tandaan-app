"use client";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import type { PointerEvent, ReactNode } from "react";
import FollowPointer from "../collaboration/follow-pointer";

export default function LiveCursorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave() {
    updateMyPresence({ cursor: null });
  }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others
        .filter((user) => user.presence.cursor != null)
        .map(({ connectionId, presence, info }) => {
          const cursor = presence.cursor;
          if (!cursor) {
            return null;
          }

          const resolvedInfo = {
            name:
              info.name ??
              (`${(info.firstName ?? "").trim()} ${(info.lastName ?? "").trim()}`.trim() ||
                "Anonymous"),
            email: info.email ?? "",
            avatar: info.avatar ?? "",
          };
          return (
            <FollowPointer
              key={connectionId}
              x={cursor.x}
              y={cursor.y}
              info={resolvedInfo}
            />
          );
        })}

      {children}
    </div>
  );
}
