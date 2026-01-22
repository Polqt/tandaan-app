export interface DocumentData {
  id: string;
  title: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: "owner" | "editor";
}

export interface DocumentUpdateData extends Partial<DocumentData> {}

export interface TrashDocument extends DocumentData {
  deleteAt: Date;
  expiresAt: Date;
  userId: string;
  roomId: string;
}
