import { clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

type ResolvedUser = {
  avatar: string;
  id: string;
  name: string;
};

function toResolvedUser(
  user: {
    fullName: string | null;
    firstName: string | null;
    id: string;
    imageUrl: string;
  },
  identifier: string,
) {
  return {
    avatar: user.imageUrl || "",
    id: user.id || identifier,
    name: user.fullName || user.firstName || "Anonymous",
  };
}

function unknownUser(identifier: string): ResolvedUser {
  return {
    avatar: "",
    id: identifier,
    name: "Unknown User",
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIds = searchParams
      .getAll("userIds")
      .map((identifier) => identifier.trim())
      .filter(Boolean);

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return new NextResponse("Missing or invalid userIds", { status: 400 });
    }

    const uniqueIdentifiers = Array.from(new Set(userIds));
    const clerkIds = uniqueIdentifiers.filter(
      (identifier) => !identifier.includes("@"),
    );
    const emailIdentifiers = uniqueIdentifiers.filter((identifier) =>
      identifier.includes("@"),
    );

    const client = await clerkClient();
    const resolvedByIdentifier = new Map<string, ResolvedUser>();

    if (clerkIds.length > 0) {
      try {
        const result = await client.users.getUserList({
          limit: clerkIds.length,
          userId: clerkIds,
        });
        const usersById = new Map(
          result.data.map((user) => [user.id, toResolvedUser(user, user.id)]),
        );

        for (const clerkId of clerkIds) {
          resolvedByIdentifier.set(
            clerkId,
            usersById.get(clerkId) ?? unknownUser(clerkId),
          );
        }
      } catch (error) {
        console.error("Error fetching users by id:", error);
        for (const clerkId of clerkIds) {
          resolvedByIdentifier.set(clerkId, unknownUser(clerkId));
        }
      }
    }

    if (emailIdentifiers.length > 0) {
      try {
        const result = await client.users.getUserList({
          emailAddress: emailIdentifiers,
          limit: emailIdentifiers.length,
        });
        const usersByEmail = new Map<string, ResolvedUser>();

        for (const user of result.data) {
          const normalizedUser = toResolvedUser(user, user.id);
          for (const emailAddress of user.emailAddresses) {
            const normalizedEmail = emailAddress.emailAddress.toLowerCase();
            if (!usersByEmail.has(normalizedEmail)) {
              usersByEmail.set(normalizedEmail, normalizedUser);
            }
          }
        }

        for (const email of emailIdentifiers) {
          resolvedByIdentifier.set(
            email,
            usersByEmail.get(email.toLowerCase()) ?? unknownUser(email),
          );
        }
      } catch (error) {
        console.error("Error fetching users by email:", error);
        for (const email of emailIdentifiers) {
          resolvedByIdentifier.set(email, unknownUser(email));
        }
      }
    }

    const users = userIds.map(
      (identifier) =>
        resolvedByIdentifier.get(identifier) ?? unknownUser(identifier),
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
