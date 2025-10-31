"use client";

import LiveBlocksProvider from "@/components/liveblocks-provider";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
