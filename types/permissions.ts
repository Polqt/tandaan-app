export type Permission =
  | "view"
  | "comment"
  | "edit"
  | "delete"
  | "invite"
  | "manage";

export interface RolePermissions {
  viewer: Permission[];
  commenter: Permission[];
  editor: Permission[];
  owner: Permission[];
}

export const DEFAULT_PERMISSIONS: RolePermissions = {
  viewer: ["view"],
  commenter: ["view", "comment"],
  editor: ["view", "comment", "edit"],
  owner: ["view", "comment", "edit", "delete", "invite", "manage"],
};
