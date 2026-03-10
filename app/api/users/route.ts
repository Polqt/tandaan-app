import { clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

type ResolvedUser = {
  avatar: string;
  id: string;
  name: string;
};

async function resolveUser(
  client: Awaited<ReturnType<typeof clerkClient>>,
  identifier: string,
) {
  if (identifier.includes("@")) {
    const userList = await client.users.getUserList({
      emailAddress: [identifier],
      limit: 1,
    });
    return userList.data[0] ?? null;
  }

  return client.users.getUser(identifier);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIds = searchParams.getAll("userIds");

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return new NextResponse("Missing or invalid userIds", { status: 400 });
    }

    const client = await clerkClient();
    const users: ResolvedUser[] = await Promise.all(
      userIds.map(async (identifier) => {
        try {
          const user = await resolveUser(client, identifier);
          if (!user) {
            return {
              avatar: "",
              id: identifier,
              name: "Unknown User",
            };
          }

          return {
            avatar: user.imageUrl || "",
            id: user.id,
            name: user.fullName || user.firstName || "Anonymous",
          };
        } catch (error) {
          console.error(`Error fetching user ${identifier}:`, error);
          return {
            avatar: "",
            id: identifier,
            name: "Unknown User",
          };
        }
      }),
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
