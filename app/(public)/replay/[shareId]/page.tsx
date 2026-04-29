import { notFound } from "next/navigation";
import PublicReplay from "@/components/documents/public-replay";
import { getReplayTimelineByShareId } from "@/services/replay";

type ReplayPageProps = {
  params: Promise<{ shareId: string }>;
};

export default async function ReplayPage({ params }: ReplayPageProps) {
  const { shareId } = await params;
  const timeline = await getReplayTimelineByShareId(shareId);

  if (!timeline) {
    notFound();
  }

  return <PublicReplay shareId={shareId} timeline={timeline} />;
}
