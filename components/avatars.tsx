"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Participant = {
  avatar: string;
  id: string;
  name: string;
};

function getInitials(name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return "?";
  }

  return trimmedName
    .split(" ")
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() || "")
    .join("");
}

export default function Avatars() {
  const selfParticipant = useSelf((self) => {
    if (!self) {
      return null;
    }

    return {
      avatar: self.info?.avatar ?? "",
      id: self.id,
      name: self.info?.name ?? "You",
    } satisfies Participant;
  });

  const otherParticipants = useOthers((others) =>
    others.map((participant) => ({
      avatar: participant.info?.avatar ?? "",
      id: participant.id,
      name: participant.info?.name ?? "Anonymous",
    })),
  );

  const participants = useMemo(
    () =>
      [selfParticipant, ...otherParticipants].filter(
        (participant): participant is Participant => participant !== null,
      ),
    [otherParticipants, selfParticipant],
  );

  return (
    <div className="flex items-center gap-2.5">
      <div className="text-right hidden sm:block">
        <p className="text-[10px] uppercase tracking-[0.16em] text-es-muted">
          Active now
        </p>
        <p className="text-[11px] font-medium text-es-primary">
          {participants.length} collaborator
          {participants.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex -space-x-1.5">
        {participants.map((participant) => (
          <Tooltip key={participant.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-es-canvas">
                <AvatarImage alt={participant.name} src={participant.avatar} />
                <AvatarFallback className="bg-[#eeede8] text-[10px] font-medium text-es-primary">
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>
              <p>{participant.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
