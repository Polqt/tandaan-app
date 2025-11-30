export type User = {
  id: string;
  fullName: string;
  email: string;
  image: string;
};

export type RoomUser = {
  id: string;
  userId: string;
  role: "owner" | "editor";
  roomId: string;
};
