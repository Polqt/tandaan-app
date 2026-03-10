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
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
          Active now
        </p>
        <p className="text-sm text-stone-600">
          {participants.length} collaborator
          {participants.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex -space-x-2">
        {participants.map((participant) => (
          <Tooltip key={participant.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 border-2 border-[#fbfbfa] shadow-sm">
                <AvatarImage alt={participant.name} src={participant.avatar} />
                <AvatarFallback className="bg-stone-100 text-xs font-medium text-stone-700">
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
