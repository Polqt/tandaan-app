export interface DocumentData {
  id: string;
  title: string;
  role: "owner" | "editor";
  [key: string]: any;
}
