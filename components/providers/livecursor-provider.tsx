"use client";

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import React, { PointerEvent } from "react";
import FollowPointer from "../follow-pointer";

export default function LiveCursorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [myPresence, updateMyPresence] = useMyPresence();
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
        .map(({ connectionId, presence, info }) => (
          <FollowPointer
            key={connectionId}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
            info={info}
          />
        ))}

      {children}
    </div>
  );
}
