import type {
  ReplayProfilesByUserId,
  VersionChangeSummary,
} from "@/types/version";

export { getDisplayInitials } from "@/lib/users/display";

export function buildReplayShareUrl(
  shareId: string,
  versionId: string,
  origin: string,
) {
  const url = new URL(`/replay/${shareId}`, origin);
  url.searchParams.set("version", versionId);
  return url.toString();
}

export function getReplayProfileName(
  profilesByUserId: ReplayProfilesByUserId,
  userId: string,
  fallback = "Unknown collaborator",
) {
  return profilesByUserId[userId]?.name || fallback;
}

export function formatActivityAction(summary?: VersionChangeSummary) {
  const {
    addedBlocks = 0,
    updatedBlocks = 0,
    removedBlocks = 0,
  } = summary ?? {};
  const parts: string[] = [];

  if (addedBlocks > 0) {
    parts.push(`added ${addedBlocks} block${addedBlocks > 1 ? "s" : ""}`);
  }

  if (updatedBlocks > 0) {
    parts.push(`edited ${updatedBlocks}`);
  }

  if (removedBlocks > 0) {
    parts.push(`removed ${removedBlocks}`);
  }

  return parts.length > 0 ? parts.join(", ") : "made changes";
}
