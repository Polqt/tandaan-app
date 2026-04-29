import { notFound } from "next/navigation";
import EmbedReplay from "@/components/documents/embed-replay";
import { getReplayTimelineByShareId } from "@/services/replay";

// Allow this route to be embedded in iframes from any origin
export const headers = () => [
  ["X-Frame-Options", "ALLOWALL"],
  ["Content-Security-Policy", "frame-ancestors *"],
];

type EmbedPageProps = {
  params: Promise<{ shareId: string }>;
};

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { shareId } = await params;
  const timeline = await getReplayTimelineByShareId(shareId);

  if (!timeline) notFound();

  return <EmbedReplay shareId={shareId} timeline={timeline} />;
}
