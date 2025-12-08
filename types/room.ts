export interface RoomDocument {
  id: string;
  roomId: string;
  createdAt: string;
  role: "owner" | "editor";
  userId: string;
  document?: {
    title?: string;
    [key: string]: any;
  };
}
