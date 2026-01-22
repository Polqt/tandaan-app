import { DocumentData } from "@/types/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      const json = await response.json();
      return json.document as DocumentData;
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!documentId,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DocumentData> }) => {
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
      await queryClient.cancelQueries({ queryKey: ["document", id] });
      await queryClient.cancelQueries({ queryKey: ["rooms"] });
      await queryClient.cancelQueries({ queryKey: ["documents"] });

      const previousDocument = queryClient.getQueryData(["document", id]);
      const previousRooms = queryClient.getQueryData(["rooms"]);
      const previousDocuments = queryClient.getQueryData(["documents"]);

      queryClient.setQueryData(["document", id], (old: any) => ({
        ...old,
        ...data,
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
                    ...data,
                  },
                }
              : room,
          ),
        };
      });

      return { previousDocument, previousRooms, previousDocuments };
    },
    onError: (err, variables, context) => {
      if (context?.previousDocument) {
        queryClient.setQueryData(
          ["document", variables.id],
          context.previousDocument,
        );
      }
      if (context?.previousRooms) {
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
        queryClient.setQueryData(["rooms"], context.previousRooms);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["document", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
