import { clerkClient } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const key = process.env.LIVEBLOCKS_PRIVATE_KEY;

if (!key) {
  throw new Error("LIVEBLOCKS_PRIVATE_KEY is not defined");
}

const liveblocks = new Liveblocks({
  secret: key,
});

export async function resolveUsers(userIds: string[]) {
  const client = await clerkClient();

  const results = await Promise.allSettled(
    userIds.map((userId) => client.users.getUser(userId)),
  );

  return results.map((result) => {
    if (result.status === "rejected") {
      return { name: "Unknown user", avatar: undefined };
    }
    const user = result.value;
    return {
      name:
        user.firstName ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown user",
      avatar: user.imageUrl || undefined,
    };
  });
}

export default liveblocks;
