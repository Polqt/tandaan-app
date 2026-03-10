export type User = {
  id: string;
  fullName: string;
  email: string;
  image: string;
};

export type RoomUser = {
  id: string;
  image?: string;
  name?: string;
  userId: string;
  role: "owner" | "editor";
  roomId: string;
  email?: string;
};
