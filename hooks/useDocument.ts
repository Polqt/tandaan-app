import { db } from "@/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const docRef = doc(db, "documents", documentId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw new Error("Document not found");
      return { id: snapshot.id, ...snapshot.data() };
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await updateDoc(doc(db, "documents", id), data);
    },
    onSuccess: (_data, variables) => {},
  });
}
