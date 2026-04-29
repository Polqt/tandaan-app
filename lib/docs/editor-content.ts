export type SerializedBlock = {
  content?: string | Array<{ text?: string }>;
  id?: string;
  type?: string;
};

export function createIdempotencyKey() {
  return crypto.randomUUID();
}

export function getDocumentBackupKey(roomId: string) {
  return `tandaan:offline-draft:${roomId}`;
}

export function parseSerializedBlocks(content: string | null | undefined) {
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    return Array.isArray(parsed) ? (parsed as SerializedBlock[]) : null;
  } catch (error) {
    console.warn("Could not parse serialized document content:", error);
    return null;
  }
}

export function isDocumentEmpty(blocks: SerializedBlock[]) {
  if (blocks.length === 0) {
    return true;
  }

  if (blocks.length > 1) {
    return false;
  }

  const [firstBlock] = blocks;
  if (!firstBlock) {
    return true;
  }

  if (typeof firstBlock.content === "string") {
    return firstBlock.content.trim().length === 0;
  }

  if (Array.isArray(firstBlock.content)) {
    return firstBlock.content.every((item) => (item.text ?? "").trim() === "");
  }

  return true;
}
