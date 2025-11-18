import LiveBlocksProvider from "@/components/providers/liveblocks-provider";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
