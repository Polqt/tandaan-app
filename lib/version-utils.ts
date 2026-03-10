import type { Version, VersionChangeSummary } from "@/types/version";

type EditorBlock = {
  id?: string;
  type?: string;
  content?: unknown;
  children?: unknown;
};

type FlatBlock = {
  id: string;
  signature: string;
};

const EMPTY_SUMMARY: VersionChangeSummary = {
  addedBlocks: 0,
  updatedBlocks: 0,
  removedBlocks: 0,
};

function parseEditorBlocks(content: string | null | undefined): EditorBlock[] {
  if (!content) {
    return [];
  }

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? (parsed as EditorBlock[]) : [];
  } catch {
    return [];
  }
}

function extractTextContent(content: unknown): string {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(extractTextContent).join(" ").trim();
  }

  if (typeof content === "object") {
    const value = content as Record<string, unknown>;
    if (typeof value.text === "string") {
      return value.text;
    }

    if (value.content) {
      return extractTextContent(value.content);
    }
  }

  return "";
}

function flattenBlocks(blocks: EditorBlock[], parentId = "root"): FlatBlock[] {
  return blocks.flatMap((block, index) => {
    const blockId = block.id || `${parentId}-${index}`;
    const signature = `${block.type || "unknown"}:${extractTextContent(block.content)}`;
    const childBlocks = Array.isArray(block.children)
      ? flattenBlocks(block.children as EditorBlock[], blockId)
      : [];

    return [{ id: blockId, signature }, ...childBlocks];
  });
}

export function computeVersionSummary(
  currentContent: string,
  previousContent?: string | null,
): VersionChangeSummary {
  const currentBlocks = flattenBlocks(parseEditorBlocks(currentContent));
  const previousBlocks = flattenBlocks(parseEditorBlocks(previousContent));

  if (currentBlocks.length === 0 && previousBlocks.length === 0) {
    return EMPTY_SUMMARY;
  }

  const previousById = new Map(
    previousBlocks.map((block) => [block.id, block.signature]),
  );
  const currentById = new Map(
    currentBlocks.map((block) => [block.id, block.signature]),
  );

  const addedBlocks = currentBlocks.filter(
    (block) => !previousById.has(block.id),
  ).length;
  const updatedBlocks = currentBlocks.filter((block) => {
    const previousSignature = previousById.get(block.id);
    return (
      previousSignature !== undefined && previousSignature !== block.signature
    );
  }).length;
  const removedBlocks = previousBlocks.filter(
    (block) => !currentById.has(block.id),
  ).length;

  return { addedBlocks, updatedBlocks, removedBlocks };
}

export function formatVersionTimestamp(value: string) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.valueOf())) {
    return "Unknown timestamp";
  }

  return parsedDate.toLocaleString();
}

export function summarizeVersionChange(summary?: VersionChangeSummary) {
  if (!summary) {
    return "Change summary unavailable";
  }

  return `+${summary.addedBlocks} / ~${summary.updatedBlocks} / -${summary.removedBlocks}`;
}

export function extractPreviewText(content: string, maxLines = 10) {
  const blocks = parseEditorBlocks(content);
  const lines = flattenBlocks(blocks)
    .map((block) => block.signature.split(":")[1] || "")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines);

  return lines.length > 0
    ? lines.join("\n")
    : "No preview available for this snapshot.";
}

export function describeVersionChange(summary?: VersionChangeSummary) {
  if (!summary) {
    return "Change details unavailable";
  }

  const fragments = [
    `${summary.addedBlocks} added`,
    `${summary.updatedBlocks} updated`,
    `${summary.removedBlocks} removed`,
  ];

  return fragments.join(" • ");
}

export function getInitialReplayIndex(
  versions: Version[],
  versionId?: string | null,
) {
  if (versions.length === 0) {
    return 0;
  }

  if (!versionId) {
    return versions.length - 1;
  }

  const index = versions.findIndex((version) => version.id === versionId);
  return index >= 0 ? index : versions.length - 1;
}
