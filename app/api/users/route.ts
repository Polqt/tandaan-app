import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIds = searchParams.getAll("userIds");

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new NextResponse("Missing or invalid userIds", { status: 400 });
    }

    const client = await clerkClient();
    
    const users = await Promise.all(
      userIds.map(async (identifier) => {
        try {
          let user;
          
          // Check if it's an email or user ID
          if (identifier.includes("@")) {
            // It's an email, search by email
            const userList = await client.users.getUserList({
              emailAddress: [identifier],
              limit: 1,
            });
            user = userList.data[0];
          } else {
            // It's a user ID
            user = await client.users.getUser(identifier);
          }

          if (!user) {
            return {
              name: "Unknown User",
              avatar: "",
            };
          }

          return {
            name: user.fullName || user.firstName || "Anonymous",
            avatar: user.imageUrl || "",
          };
        } catch (error) {
          console.error(`Error fetching user ${identifier}:`, error);
          return {
            name: "Unknown User",
            avatar: "",
          };
        }
      })
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
