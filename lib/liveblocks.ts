import { Liveblocks } from "@liveblocks/node";
import { clerkClient } from "@clerk/nextjs/server";

const key = process.env.LIVEBLOCKS_PRIVATE_KEY;

if (!key) {
  throw new Error("LIVEBLOCKS_PRIVATE_KEY is not defined");
}

const liveblocks = new Liveblocks({
  secret: key,
});

export async function resolveUsers(userIds: string[]) {
  const client = await clerkClient();

  const users = await Promise.all(
    userIds.map(async (userId) => {
      const user = await client.users.getUser(userId);
      return {
        name: user.firstName || user.emailAddresses[0]?.emailAddress || "Jani",
        avatar: user.imageUrl || undefined,
      };
    }),
  );

  return users;
}

export default liveblocks;
