export interface Template {
  id: string;
  name: string;
  description: string;
  category: "meeting" | "project" | "todo" | "note" | "custom";
  content: any;
  thumbnail?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}
