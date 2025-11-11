"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";

export default function LiveBlocksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error("LIVEBLOCKS_PUBLIC_KEY is not defined");
  }

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={"/api/auth-endpoint"}
      resolveUsers={async ({ userIds }) => {
        const searchParams = new URLSearchParams(
          userIds.map((userId) => ["userIds", userId]),
        );
        const response = await fetch(`/api/users?${searchParams}`);

        if (!response.ok) {
          throw new Error("Problem resolving users");
        }

        const users = await response.json();
        return users;
      }}
    >
      {children}
    </LiveblocksProvider>
  );
}
