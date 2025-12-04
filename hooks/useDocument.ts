import { db } from "@/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document`")
      }
      const json = await response.json();
      return json.document;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!documentId,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      return response.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["document", id ] });
      await queryClient.cancelQueries({ queryKey: ["rooms"] });

      const previousDocument = queryClient.getQueryData(["document", id]);
      const previousRooms = queryClient.getQueryData(["rooms"])

      queryClient.setQueryData(["documents", id], (old: any) => ({
        ...old,
        ...data
      }));

      queryClient.setQueryData(["rooms"], (old: any) => {
        if (!old?.rooms) return old;
        return {
          rooms: old.rooms.map((room: any) => 
            room.id === id || room.roomId === id
            ? {
              ...room,
              document: {
                ...room.document,
                ...data
              },
            }
            : room
          )
        }
      });
      
      return { previousDocument, previousRooms };
    },
    onError: (err, variables, context) => {
      if (context?.previousDocument) {
        queryClient.setQueryData(["document", variables.id], context.previousDocument);
      }
      if (context?.previousRooms) {
        queryClient.setQueryData(["rooms"], context.previousRooms);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["document", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  });
}