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

export function useRooms(enabled = true) {
  return useQuery<RoomsQueryResult>({
    enabled,
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await fetch(`/api/rooms`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const json = await response.json();
      return json;
    },
    staleTime: 5 * 60 * 1000,
  });
}
