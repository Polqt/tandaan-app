import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DocumentData } from "@/types/documents";

type UpdateDocumentInput = {
  data: Partial<DocumentData>;
  id: string;
};

type RoomDocumentRecord = {
  document?: Partial<DocumentData>;
  id: string;
  roomId?: string;
};

type RoomsQueryResult = {
  rooms: RoomDocumentRecord[];
};

type DocumentsQueryResult = {
  documents: Array<{
    id: string;
    title?: string;
  }>;
};

type MutationContext = {
  previousDocument?: DocumentData;
  previousDocuments?: DocumentsQueryResult;
  previousRooms?: RoomsQueryResult;
};

export function useDocument(documentId: string) {
  return useQuery<DocumentData>({
    enabled: Boolean(documentId),
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const payload = (await response.json()) as {
        document?: Partial<DocumentData>;
        role?: "editor" | "owner";
      };

      const document = payload.document ?? {};
      const role = payload.role === "owner" ? "owner" : "editor";

      return {
        ...document,
        id: typeof document.id === "string" ? document.id : documentId,
        role,
        title:
          typeof document.title === "string" && document.title.trim().length > 0
            ? document.title
            : "Untitled Document",
      };
    },
    queryKey: ["document", documentId],
    staleTime: 30 * 60 * 1000,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateDocumentInput, MutationContext>({
    mutationFn: async ({ data, id }: UpdateDocumentInput) => {
      const response = await fetch(`/api/documents/${id}`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      return response.json();
    },
    onError: (_error, variables, context) => {
      if (context?.previousDocument) {
        queryClient.setQueryData(
          ["document", variables.id],
          context.previousDocument,
        );
      }

      if (context?.previousRooms) {
        queryClient.setQueryData(["rooms"], context.previousRooms);
      }

      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
    },
    onMutate: async ({ data, id }): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["document", id] });
      await queryClient.cancelQueries({ queryKey: ["rooms"] });
      await queryClient.cancelQueries({ queryKey: ["documents"] });

      const previousDocument = queryClient.getQueryData<DocumentData>([
        "document",
        id,
      ]);
      const previousRooms = queryClient.getQueryData<RoomsQueryResult>([
        "rooms",
      ]);
      const previousDocuments = queryClient.getQueryData<DocumentsQueryResult>([
        "documents",
      ]);

      queryClient.setQueryData<DocumentData | undefined>(
        ["document", id],
        (existingDocument) =>
          existingDocument
            ? { ...existingDocument, ...data }
            : existingDocument,
      );

      queryClient.setQueryData<RoomsQueryResult | undefined>(
        ["rooms"],
        (existingRooms) => {
          if (!existingRooms?.rooms) {
            return existingRooms;
          }

          return {
            rooms: existingRooms.rooms.map((room) => {
              const isTargetRoom = room.id === id || room.roomId === id;
              if (!isTargetRoom) {
                return room;
              }

              return {
                ...room,
                document: {
                  ...(room.document || {}),
                  ...data,
                },
              };
            }),
          };
        },
      );

      queryClient.setQueryData<DocumentsQueryResult | undefined>(
        ["documents"],
        (existingDocuments) => {
          if (!existingDocuments?.documents || !data.title) {
            return existingDocuments;
          }

          return {
            documents: existingDocuments.documents.map((document) =>
              document.id === id
                ? { ...document, title: data.title }
                : document,
            ),
          };
        },
      );

      return { previousDocument, previousDocuments, previousRooms };
    },
  });
}
