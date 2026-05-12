/**
 * AI-powered document version summary generation
 * Uses Cloudflare Workers AI to generate narrative summaries
 */

import { loggerWithRequest } from "@/lib/telemetry/logger";

const WORKER_URL = process.env.CLOUDFLARE_AI_WORKER_URL;
const WORKER_SECRET = process.env.CLOUDFLARE_AI_WORKER_SECRET;

const logger = loggerWithRequest("replay-summary");

export interface VersionSummaryInput {
  currentVersion: {
    content: string;
    summary: {
      addedBlocks: number;
      updatedBlocks: number;
      removedBlocks: number;
    };
    timestamp: string;
  };
  previousVersion: {
    content: string;
    summary: {
      addedBlocks: number;
      updatedBlocks: number;
      removedBlocks: number;
    };
    timestamp: string;
  } | null;
  documentTitle: string;
}

export interface VersionSummaryOutput {
  aiSummary: string;
  chapterLabel: string;
  tokensUsed?: number;
}

/**
 * Generate AI-powered summary for document version changes
 * Returns null if worker is not configured
 */
export async function generateVersionSummary(
  input: VersionSummaryInput,
): Promise<VersionSummaryOutput | null> {
  // Skip if worker is not configured
  if (!WORKER_URL || !WORKER_SECRET) {
    logger.warn({
      msg: "Cloudflare AI Worker not configured, skipping AI summary",
      url: WORKER_URL,
    });
    return null;
  }

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": WORKER_SECRET,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({
        msg: "AI summary worker failed",
        status: response.status,
        error: errorText,
      });
      return null;
    }

    const result = (await response.json()) as VersionSummaryOutput;
    return result;
  } catch (error) {
    logger.error({
      msg: "Error calling AI summary worker",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

/**
 * Generate chapter label based on change magnitude
 * Fallback when AI worker is unavailable
 */
export function generateChapterLabel(
  changeSummary: VersionSummaryInput["currentVersion"]["summary"],
): string {
  const totalChanges =
    changeSummary.addedBlocks +
    changeSummary.updatedBlocks +
    changeSummary.removedBlocks;

  if (totalChanges === 0) {
    return "Initial version";
  }
  if (totalChanges <= 2) {
    return "Minor edit";
  }
  if (totalChanges <= 5) {
    return "Incremental edit";
  }
  if (changeSummary.addedBlocks > changeSummary.updatedBlocks) {
    return "Content added";
  }
  if (changeSummary.removedBlocks > changeSummary.addedBlocks) {
    return "Content removed";
  }
  return "Major revision";
}
