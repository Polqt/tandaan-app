export interface RoomDocument {
  id: string;
  roomId: string;
  createdAt: string;
  role: "owner" | "editor";
  userId: string;
  document?: {
    id?: string;
    title?: string;
    replayShareId?: string | null;
    updatedAt?: string | null;
  };
}
