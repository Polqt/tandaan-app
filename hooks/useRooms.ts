import { useQuery } from "@tanstack/react-query";

export function useRooms() {
  return useQuery({
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
