import { useQuery } from "@tanstack/react-query";
import type { DocumentData } from "@/types/documents";

type RoomRecord = {
  createdAt?: string;
  document?: Partial<DocumentData>;
  id: string;
  role: "owner" | "editor";
  roomId?: string;
  roomid?: string;
  userId: string;
};

type RoomsQueryResult = {
  rooms: RoomRecord[];
};

export function useRooms(userId?: string | null, enabled = true) {
  return useQuery<RoomsQueryResult>({
    enabled: Boolean(userId) && enabled,
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/rooms", { signal });
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const json = await response.json();
      return json;
    },
    queryKey: ["rooms", userId ?? "anonymous"],
    staleTime: 5 * 60 * 1000,
  });
}
