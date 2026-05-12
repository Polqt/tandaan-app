/**
 * AI-powered editor assistants for Tandaan
 * Uses Cloudflare Workers AI endpoints
 */

// Extract base URL (remove any path)
const getBaseUrl = () => {
  const url = process.env.CLOUDFLARE_AI_WORKER_URL || "https://tandaan-replay-ai.poyhidalgo.workers.dev";
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url;
  }
};

const BASE_URL = getBaseUrl();
const API_SECRET = process.env.CLOUDFLARE_AI_WORKER_SECRET || "jxfunxDpK5xwEsYLy0pWa9jP5KV7Z6aoITS";

// Debounce helper
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}

export interface TranslateResult {
  success: true;
  translatedText: string;
  detectedLanguage?: string;
}

export interface DetectLanguageResult {
  success: true;
  language: string;
  confidence: number;
}

export interface AISuggestionResult {
  success: true;
  suggestions: string[];
}

export type AIError = {
  success: false;
  error: string;
};

type TranslateResponse = TranslateResult | AIError;
type DetectLanguageResponse = DetectLanguageResult | AIError;
type AISuggestionResponse = AISuggestionResult | AIError;

/**
 * Translate text to target language
 */
export async function translateText(
  text: string,
  targetLanguage: string,
): Promise<TranslateResponse> {
  if (!text.trim()) {
    return { success: false, error: "No text to translate" };
  }

  if (!targetLanguage) {
    return { success: false, error: "Target language required" };
  }

  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_SECRET,
      },
      body: JSON.stringify({ text, targetLanguage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Translation failed: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      translatedText: data.translatedText || data.text || "",
      detectedLanguage: data.detectedLanguage,
    };
  } catch (error) {
    console.error("Translate error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Translation failed",
    };
  }
}

/**
 * Detect the language of text
 */
export async function detectLanguage(text: string): Promise<DetectLanguageResponse> {
  if (!text.trim()) {
    return { success: false, error: "No text to analyze" };
  }

  try {
    const response = await fetch(`${BASE_URL}/detect-language`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_SECRET,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Detection failed: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      language: data.language || "unknown",
      confidence: data.confidence || 0,
    };
  } catch (error) {
    console.error("Detect language error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Language detection failed",
    };
  }
}

/**
 * Get AI writing suggestions based on context
 */
export async function getAISuggestion(
  context: string,
  documentTitle: string,
): Promise<AISuggestionResponse> {
  if (!context.trim()) {
    return { success: false, error: "No context to analyze" };
  }

  try {
    const response = await fetch(`${BASE_URL}/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_SECRET,
      },
      body: JSON.stringify({ context, documentTitle }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Suggestion failed: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      suggestions: data.suggestions || [],
    };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Suggestions failed",
    };
  }
}

// Debounced versions for use in editor (2 second delay)
export const debouncedTranslate = debounce(translateText, 2000);
export const debouncedDetectLanguage = debounce(detectLanguage, 2000);
export const debouncedAISuggestion = debounce(getAISuggestion, 2000);