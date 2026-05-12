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
/**
 * Converts BlockNote JSON content to plain text
 */
export function blocksToPlainText(content: string | null | undefined): string {
  if (!content) {
    return "";
  }

  const blocks = parseSerializedBlocks(content);
  if (!blocks || blocks.length === 0) {
    return "";
  }

  const textParts: string[] = [];

  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "heading") {
      if (typeof block.content === "string") {
        textParts.push(block.content);
      } else if (Array.isArray(block.content)) {
        const blockText = block.content.map((item) => item.text ?? "").join("");
        textParts.push(blockText);
      }
    } else if (
      block.type === "bulletListItem" ||
      block.type === "numberedListItem"
    ) {
      if (typeof block.content === "string") {
        textParts.push(`• ${block.content}`);
      } else if (Array.isArray(block.content)) {
        const itemText = block.content.map((item) => item.text ?? "").join("");
        textParts.push(`• ${itemText}`);
      }
    }
    // Add more block types as needed
  }

  return textParts.join("\n");
}
