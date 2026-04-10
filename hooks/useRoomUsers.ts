import { useQuery } from "@tanstack/react-query";
import type { RoomUser } from "@/types/user";

type RoomUsersResult = {
  users: RoomUser[];
};

export function useRoomUsers(roomId: string | undefined) {
  return useQuery<RoomUsersResult>({
    enabled: Boolean(roomId),
    queryKey: ["room-users", roomId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/rooms/${roomId}/users`, { signal });
      if (!response.ok) throw new Error("Failed to fetch room users");
      return response.json();
    },
    staleTime: 2 * 60 * 1000,
  });
}
