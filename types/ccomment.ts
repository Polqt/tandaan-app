export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  selection?: {
    from: number;
    to: number;
  };
  parentId?: string;
  resolved?: boolean;
}
