"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Avatars() {
  const others = useOthers();
  const self = useSelf();

  const all = [self, ...others];

  return (
    <div className="flex gap-2 items-center">
      <p className="font-light text-sm">users currently editing this page</p>

      <div className="flex -space-x-5">
        {all.map((user, i) => (
          <div key={i}>
            <TooltipProvider key={user?.id + i}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="border-2 hover:z-50">
                    <AvatarImage src={user?.info.avatar} />
                    <AvatarFallback>{user?.info.name}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{self?.id === user?.id ? "you" : user?.info.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
