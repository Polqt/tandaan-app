"use client";

import type { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/shadcn/style.css";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import {
  getYjsProviderForRoom,
  type LiveblocksYjsProvider,
} from "@liveblocks/yjs";
import {
  AlertTriangle,
  Check,
  Copy,
  FilePlus2,
  Languages,
  LayoutTemplate,
  Lightbulb,
  RotateCcw,
  Sparkles,
  WifiOff,
  X,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getDocumentTemplate } from "@/lib/docs/document-templates";
import {
  blocksToPlainText,
  createIdempotencyKey,
  getDocumentBackupKey,
  isDocumentEmpty,
  parseSerializedBlocks,
  type SerializedBlock,
} from "@/lib/docs/editor-content";
import {
  debouncedAISuggestion,
  debouncedTranslate,
  detectLanguage,
  getAISuggestion,
  translateText,
} from "@/lib/ai/editor-assistants";
import { loggerWithRequest } from "@/lib/telemetry/logger";
import stringToColor from "@/lib/users/color";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const editorLogger = loggerWithRequest("editor");

type EditorIdentity = {
  color: string;
  name: string;
};

type BlockNoteProps = {
  initialContent: string | null | undefined;
  onContentChange: (content: string) => void;
  provider: LiveblocksYjsProvider;
  userInfo: EditorIdentity;
};

type SaveState = "error" | "idle" | "offline" | "saved" | "saving";

type DraftBackup = {
  content: string;
  savedAt: number;
};

type EditorMutationApi = {
  insertBlocks?: (
    blocks: unknown[],
    referenceBlock: unknown,
    placement: "after" | "before",
  ) => void;
  removeBlocks?: (blocks: unknown[]) => void;
  replaceBlocks?: (
    blocksToRemove: unknown[],
    blocksToInsert: unknown[],
  ) => void;
};

const DOCUMENT_SAVE_DELAY_MS = 1000;
const VERSION_SNAPSHOT_INTERVAL_MS = 30000;

function insertTemplateIntoEditor(
  editor: BlockNoteEditor,
  templateId: Parameters<typeof getDocumentTemplate>[0],
) {
  const template = getDocumentTemplate(templateId);
  const templateBlocks = template.blocks as unknown[];
  const currentBlocks = editor.document as unknown as SerializedBlock[];
  const currentBlock = editor.getTextCursorPosition().block as SerializedBlock;
  const editorApi = editor as BlockNoteEditor & EditorMutationApi;

  if (!currentBlock || templateBlocks.length === 0) {
    return;
  }

  if (
    currentBlocks.length === 1 &&
    isDocumentEmpty(currentBlocks) &&
    typeof editorApi.replaceBlocks === "function"
  ) {
    editorApi.replaceBlocks([currentBlock], templateBlocks);
    return;
  }

  if (typeof editorApi.insertBlocks === "function") {
    editorApi.insertBlocks(templateBlocks, currentBlock, "after");
  }
}

const BlockNote = memo(function BlockNote({
  initialContent,
  onContentChange,
  provider,
  userInfo,
}: BlockNoteProps) {
  const fragment = useMemo(
    () => provider.getYDoc().getXmlFragment("document-store"),
    [provider],
  );

  const editor: BlockNoteEditor = useCreateBlockNote(
    {
      collaboration: {
        fragment,
        provider,
        user: userInfo,
      },
      placeholders: {
        default: "Press '/' for commands, or start writing.",
        emptyDocument: "Start with a thought, meeting note, or draft.",
      },
    },
    [fragment, provider, userInfo.color, userInfo.name],
  );
  const hasSeededInitialContentRef = useRef(false);

  useEffect(() => {
    if (hasSeededInitialContentRef.current || !provider.synced) {
      return;
    }

    if (typeof initialContent === "undefined") {
      return;
    }

    const parsedBlocks = parseSerializedBlocks(initialContent);
    const currentBlocks = editor.document as unknown as SerializedBlock[];
    if (!parsedBlocks || parsedBlocks.length === 0) {
      hasSeededInitialContentRef.current = true;
      return;
    }

    if (!isDocumentEmpty(currentBlocks)) {
      hasSeededInitialContentRef.current = true;
      return;
    }

    const editorApi = editor as BlockNoteEditor & EditorMutationApi;
    if (typeof editorApi.replaceBlocks === "function") {
      editorApi.replaceBlocks(currentBlocks, parsedBlocks);
    } else if (
      typeof editorApi.removeBlocks === "function" &&
      typeof editorApi.insertBlocks === "function" &&
      currentBlocks[0]
    ) {
      editorApi.insertBlocks(parsedBlocks, currentBlocks[0], "before");
      editorApi.removeBlocks(currentBlocks);
    }

    hasSeededInitialContentRef.current = true;
  }, [editor, initialContent, provider.synced]);

  const handleEditorChange = useCallback(() => {
    try {
      // Check if editor document is valid before serializing
      if (!editor.document || editor.document.length === 0) {
        return;
      }
      const content = JSON.stringify(editor.document);
      onContentChange(content);
    } catch (error) {
      // Silently ignore serialization errors during sync conflicts
      console.warn("Editor change handler skipped:", error);
    }
  }, [editor, onContentChange]);

  const slashMenuItems = useMemo(() => {
    const defaults = getDefaultReactSlashMenuItems(editor);
    return [
      {
        aliases: ["meeting", "agenda", "notes"],
        group: "Templates",
        icon: <FilePlus2 className="h-4 w-4" />,
        onItemClick: () => insertTemplateIntoEditor(editor, "meeting-notes"),
        subtext: "Agenda, notes, decisions, and actions.",
        title: "Meeting notes starter",
      },
      {
        aliases: ["brief", "product", "launch"],
        group: "Templates",
        icon: <LayoutTemplate className="h-4 w-4" />,
        onItemClick: () => insertTemplateIntoEditor(editor, "product-brief"),
        subtext: "Problem, metrics, rollout, and constraints.",
        title: "Product brief starter",
      },
      {
        aliases: ["decision", "log", "tradeoff"],
        group: "Templates",
        icon: <Sparkles className="h-4 w-4" />,
        onItemClick: () => insertTemplateIntoEditor(editor, "decision-log"),
        subtext: "Decision, rationale, and risk in one block.",
        title: "Decision log starter",
      },
      ...defaults,
    ];
  }, [editor]);

  const getSlashItems = useCallback(
    async (query: string) => {
      const normalizedQuery = query.toLowerCase().trim();
      if (!normalizedQuery) {
        return slashMenuItems;
      }

      return slashMenuItems.filter((item) => {
        const haystack = [
          item.title,
          item.subtext ?? "",
          ...(item.aliases ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      });
    },
    [slashMenuItems],
  );

  return (
    <BlockNoteView
      className="min-h-[calc(100vh-13rem)] [&_.bn-container]:mx-auto [&_.bn-container]:max-w-208 [&_.bn-container]:border-0 [&_.bn-editor]:bg-transparent [&_.bn-editor]:px-0 [&_.bn-editor]:py-0 [&_.bn-editor]:pt-4 [&_.bn-editor]:text-[16px] [&_.bn-editor]:leading-[1.8] [&_.bn-editor]:text-es-ink [&_.bn-editor]:caret-es-primary [&_.bn-editor]:focus:outline-none [&_.bn-side-menu]:hidden [&_.bn-toolbar]:rounded-[1.2rem] [&_.bn-toolbar]:border [&_.bn-toolbar]:border-(--color-es-line) [&_.bn-toolbar]:bg-[#f4f4f0]/92 [&_.bn-toolbar]:shadow-[0_14px_26px_rgba(47,52,48,0.08)] [&_.bn-toolbar]:backdrop-blur-xl"
      editor={editor}
      onChange={handleEditorChange}
      theme="light"
    >
      <SuggestionMenuController getItems={getSlashItems} triggerCharacter="/" />
    </BlockNoteView>
  );
});

export default function Editor() {
  const room = useRoom();
  const selfInfo = useSelf((self) => self.info);
  const provider = useMemo(() => getYjsProviderForRoom(room), [room]);
  const [isSynced, setIsSynced] = useState(provider.synced);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [backupMeta, setBackupMeta] = useState<DraftBackup | null>(null);
  const [initialServerContent, setInitialServerContent] = useState<
    string | null | undefined
  >(undefined);

  // AI Assistant states
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [translateFromLang, setTranslateFromLang] = useState<string>("auto");

  // Refs for debounced AI calls
  const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const translateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorContentRef = useRef<string>("");

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSaveControllerRef = useRef<AbortController | null>(null);
  const saveRevisionRef = useRef(0);
  const lastSavedContentRef = useRef("");
  const lastSnapshotAtRef = useRef(0);
  const lastSnapshotContentRef = useRef("");

  const backupKey = useMemo(() => getDocumentBackupKey(room.id), [room.id]);

  const userInfo = useMemo<EditorIdentity | null>(() => {
    if (!selfInfo) {
      return null;
    }

    const displayName = selfInfo.name || "Anonymous";
    const colorSeed = [displayName, selfInfo.avatar || "", room.id].join(":");

    return {
      color: stringToColor(colorSeed),
      name: displayName,
    };
  }, [room.id, selfInfo]);

  // Error handler for Yjs/Liveblocks sync issues
  // Logs errors but doesn't crash/refresh - lets user continue editing
  const handleSyncError = useCallback((error: unknown) => {
    editorLogger.warn({
      msg: "Sync error (non-fatal)",
      error: error instanceof Error ? error.message : String(error),
    });
  }, []);

  // Global error handler for uncaught errors during collaboration
  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      // Check if this is a ProseMirror/BlockNote related error
      if (
        event.message?.includes("Position") ||
        event.message?.includes("resolve") ||
        event.message?.includes("ProseMirror")
      ) {
        handleSyncError(event.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleSyncError(event.reason);
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, [handleSyncError]);

  useEffect(() => {
    const handleSynced = () => {
      setIsSynced(provider.synced);
    };

    handleSynced();
    provider.on("synced", handleSynced);

    return () => {
      provider.off("synced", handleSynced);
    };
  }, [provider]);

  useEffect(() => {
    const markOnline = () => setIsOnline(true);
    const markOffline = () => {
      setIsOnline(false);
      setSaveState("offline");
    };

    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);

    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawBackup = window.localStorage.getItem(backupKey);
      if (!rawBackup) {
        return;
      }

      const parsed = JSON.parse(rawBackup) as DraftBackup;
      if (parsed?.content) {
        setBackupMeta(parsed);
      }
    } catch (error) {
      console.warn("Could not read local draft backup:", error);
    }
  }, [backupKey]);

  useEffect(() => {
    const controller = new AbortController();

    const loadDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${room.id}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to load initial document");
        }

        const payload = (await response.json()) as {
          document?: { content?: string | null };
        };
        const content = payload.document?.content ?? null;
        setInitialServerContent(content);
        lastSavedContentRef.current = content ?? "";
        lastSnapshotContentRef.current = content ?? "";
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error loading initial document:", error);
      }
    };

    void loadDocument();

    return () => {
      controller.abort();
    };
  }, [room.id]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }

      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }

      activeSaveControllerRef.current?.abort();
    };
  }, []);

  const persistBackup = useCallback(
    (content: string) => {
      if (typeof window === "undefined" || !content) {
        return;
      }

      const backup: DraftBackup = { content, savedAt: Date.now() };
      window.localStorage.setItem(backupKey, JSON.stringify(backup));
      setBackupMeta(backup);
    },
    [backupKey],
  );

  const clearBackup = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(backupKey);
    }
    setBackupMeta(null);
  }, [backupKey]);

  const restoreBackup = useCallback(async () => {
    if (!backupMeta) {
      return;
    }

    setIsRestoringBackup(true);

    try {
      const idempotencyKey = createIdempotencyKey();
      const response = await fetch(`/api/documents/${room.id}`, {
        body: JSON.stringify({
          content: backupMeta.content,
          idempotencyKey,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to restore backup");
      }

      lastSavedContentRef.current = backupMeta.content;
      setLastSavedAt(Date.now());
      setSaveState("saved");
      clearBackup();
      toast.success("Local backup restored.");
      window.location.reload();
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast.error("Could not restore the local backup.");
    } finally {
      setIsRestoringBackup(false);
    }
  }, [backupMeta, clearBackup, room.id]);

  const shouldCreateSnapshot = useCallback((content: string) => {
    if (!content || content === lastSnapshotContentRef.current) {
      return false;
    }

    const now = Date.now();
    return now - lastSnapshotAtRef.current >= VERSION_SNAPSHOT_INTERVAL_MS;
  }, []);

  const createSnapshot = useCallback(
    async (content: string) => {
      if (!shouldCreateSnapshot(content)) {
        return;
      }

      const idempotencyKey = createIdempotencyKey();
      const response = await fetch(`/api/documents/${room.id}/versions`, {
        body: JSON.stringify({ content, idempotencyKey }),
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create version snapshot");
      }

      lastSnapshotAtRef.current = Date.now();
      lastSnapshotContentRef.current = content;
    },
    [room.id, shouldCreateSnapshot],
  );

  const handleContentChange = useCallback(
    (content: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (!content || content === lastSavedContentRef.current) {
        return;
      }

      persistBackup(content);
      setSaveState(isOnline ? "saving" : "offline");

      const revision = ++saveRevisionRef.current;

      saveTimeoutRef.current = setTimeout(async () => {
        if (revision !== saveRevisionRef.current) {
          return;
        }

        activeSaveControllerRef.current?.abort();
        const controller = new AbortController();
        activeSaveControllerRef.current = controller;

        try {
          const idempotencyKey = createIdempotencyKey();
          const response = await fetch(`/api/documents/${room.id}`, {
            body: JSON.stringify({
              content,
              idempotencyKey,
            }),
            headers: {
              "Content-Type": "application/json",
              "x-idempotency-key": idempotencyKey,
            },
            method: "PATCH",
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Save failed: ${response.status}`);
          }

          if (revision !== saveRevisionRef.current) {
            return;
          }

          lastSavedContentRef.current = content;
          setLastSavedAt(Date.now());
          setSaveState("saved");
          clearBackup();

          try {
            await createSnapshot(content);
          } catch (snapshotError) {
            console.warn("Snapshot creation failed:", snapshotError);
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }

          console.error("Error saving document:", error);
          setSaveState(
            typeof navigator !== "undefined" && !navigator.onLine
              ? "offline"
              : "error",
          );
          toast.error(
            "Failed to save document. Local backup kept on this device.",
          );
        } finally {
          if (activeSaveControllerRef.current === controller) {
            activeSaveControllerRef.current = null;
          }
        }
      }, DOCUMENT_SAVE_DELAY_MS);
    },
    [clearBackup, createSnapshot, isOnline, persistBackup, room.id],
  );

  // Fetch AI suggestion for current content
  const fetchAISuggestion = useCallback(async (content: string) => {
    if (!content || content.length < 20) {
      setAiSuggestion(null);
      setIsLoadingSuggestion(false);
      return;
    }

    try {
      const plainText = blocksToPlainText(content);
      if (!plainText || plainText.length < 20) {
        setAiSuggestion(null);
        setIsLoadingSuggestion(false);
        return;
      }

      // Get last 500 chars for context (avoid sending huge payloads)
      const context = plainText.slice(-500);
      
      const result = await getAISuggestion(context, "Untitled Document");
      
      if (result.success && result.suggestions?.[0]) {
        setAiSuggestion(result.suggestions[0]);
      } else {
        setAiSuggestion(null);
      }
    } catch (error) {
      console.warn("AI suggestion failed:", error);
      setAiSuggestion(null);
    } finally {
      setIsLoadingSuggestion(false);
    }
  }, []);

  // Handle content change with AI suggestion trigger
  const handleContentChangeWithAI = useCallback(
    (content: string) => {
      // Store content for AI
      editorContentRef.current = content;
      
      // Call original handler
      handleContentChange(content);
      
      // Cancel previous suggestion timeout
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      
      // Clear current suggestion while typing
      setAiSuggestion(null);
      setIsLoadingSuggestion(true);
      
      // Debounce AI suggestion call (2 seconds)
      suggestionTimeoutRef.current = setTimeout(() => {
        fetchAISuggestion(content);
      }, 2000);
    },
    [handleContentChange, fetchAISuggestion],
  );

  // Handle translation request
  const handleTranslate = useCallback(async (targetLanguage: string) => {
    const content = editorContentRef.current;
    if (!content) {
      toast.error("No content to translate");
      return;
    }

    const plainText = blocksToPlainText(content);
    if (!plainText.trim()) {
      toast.error("No content to translate");
      return;
    }

    setIsTranslating(true);
    setShowTranslateMenu(false);

    try {
      // First detect language if auto
      if (translateFromLang === "auto") {
        const detectResult = await detectLanguage(plainText);
        if (detectResult.success) {
          setDetectedLanguage(detectResult.language);
        }
      }

      const result = await translateText(plainText, targetLanguage);

      if (result.success) {
        setTranslatedText(result.translatedText);
        if (result.detectedLanguage) {
          setDetectedLanguage(result.detectedLanguage);
        }
        toast.success("Translation complete");
      } else {
        toast.error(result.error || "Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  }, [translateFromLang]);

  // Apply translation to editor
  const applyTranslation = useCallback(async () => {
    if (!translatedText) return;

    try {
      const idempotencyKey = createIdempotencyKey();
      const response = await fetch(`/api/documents/${room.id}`, {
        body: JSON.stringify({
          content: JSON.stringify([
            {
              id: crypto.randomUUID(),
              type: "paragraph",
              props: {
                backgroundColor: "default",
                textColor: "default",
                textAlignment: "left",
              },
              content: [
                {
                  type: "text",
                  text: translatedText,
                  styles: {},
                },
              ],
              children: [],
            },
          ]),
          idempotencyKey,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        method: "PATCH",
      });

      if (response.ok) {
        toast.success("Translation applied");
        setTranslatedText(null);
        window.location.reload();
      } else {
        toast.error("Failed to apply translation");
      }
    } catch (error) {
      console.error("Apply translation error:", error);
      toast.error("Failed to apply translation");
    }
  }, [translatedText, room.id]);

  // Clear translation
  const clearTranslation = useCallback(() => {
    setTranslatedText(null);
    setDetectedLanguage(null);
  }, []);

  const saveStatusLabel = useMemo(() => {
    if (saveState === "saving") return "Saving changes";
    if (saveState === "saved") {
      return lastSavedAt
        ? `Saved ${new Date(lastSavedAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}`
        : "Saved";
    }
    if (saveState === "offline") return "Offline backup active";
    if (saveState === "error") return "Save failed";
    return isSynced ? "Live collaboration active" : "Syncing";
  }, [isSynced, lastSavedAt, saveState]);

  return (
    <section className="w-full">
      {!userInfo ? (
        <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-es-muted">
              <Spinner className="size-3.5 text-es-primary" />
              Loading editor
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#e6e9e4]">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-es-primary" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--color-es-line) bg-[#f3f2ed] px-3 py-1.5 text-xs text-es-primary">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  saveState === "error"
                    ? "bg-red-500"
                    : saveState === "offline"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
              />
              {saveStatusLabel}
            </div>

            {!isOnline ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
                <WifiOff className="size-3.5" />
                Working offline
              </div>
            ) : null}
          </div>

          {backupMeta ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-medium">Local backup available</p>
                  <p className="text-xs leading-5 text-amber-800">
                    Unsaved content is stored on this device from{" "}
                    {new Date(backupMeta.savedAt).toLocaleString()}.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="h-8 rounded-full text-xs"
                  disabled={!isOnline || isRestoringBackup}
                  onClick={restoreBackup}
                  size="sm"
                  variant="default"
                >
                  <RotateCcw data-icon="inline-start" />
                  {isRestoringBackup ? "Restoring..." : "Restore backup"}
                </Button>
                <Button
                  className="h-8 rounded-full bg-white text-xs text-amber-900 hover:bg-white/90"
                  onClick={async () => {
                    const plainText = blocksToPlainText(backupMeta.content);
                    await navigator.clipboard.writeText(plainText);
                    toast.success("Backup text copied to clipboard.");
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <Copy data-icon="inline-start" />
                  Copy backup
                </Button>
                <Button
                  className="h-8 rounded-full text-xs"
                  onClick={() => {
                    clearBackup();
                    toast.success("Local backup cleared.");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Check data-icon="inline-start" />
                  Dismiss
                </Button>
              </div>
            </div>
          ) : null}

          {!isSynced ? (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--color-es-line) bg-[#f3f2ed] px-3 py-1.5 text-xs text-es-primary">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Syncing collaboration state...
            </div>
          ) : null}

          {/* AI Toolbar */}
          <div className="mb-3 flex items-center gap-2">
            <Button
              className="h-8 rounded-full text-xs gap-1.5"
              disabled={isTranslating}
              onClick={() => {
                setShowTranslateMenu(!showTranslateMenu);
                if (showTranslateMenu) {
                  // Clear translation state when closing menu
                  setTranslatedText(null);
                  setDetectedLanguage(null);
                }
              }}
              size="sm"
              variant="outline"
            >
              <Languages className="size-3.5" />
              {isTranslating ? "Translating..." : "Translate"}
            </Button>

            {aiSuggestion && (
              <div className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs text-purple-800">
                <Lightbulb className="size-3.5 shrink-0" />
                <span className="line-clamp-1 max-w-[200px]">{aiSuggestion}</span>
              </div>
            )}

            {isLoadingSuggestion && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Spinner className="size-3.5" />
                Getting suggestion...
              </div>
            )}
          </div>

          {/* Translate Menu */}
          {showTranslateMenu && (
            <div className="mb-4 rounded-xl border border-es-line bg-white p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium">Translate to</h4>
                <Button
                  className="h-6 w-6 rounded-full p-0"
                  onClick={() => setShowTranslateMenu(false)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {["en", "es", "fr", "de", "it", "pt", "zh", "ja", "ko", "ar"].map(
                  (lang) => (
                    <Button
                      key={lang}
                      className="text-xs"
                      onClick={() => handleTranslate(lang)}
                      size="sm"
                      variant="outline"
                    >
                      {lang.toUpperCase()}
                    </Button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Translation Result */}
          {translatedText && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages className="size-4 text-green-600" />
                  <span className="text-sm font-medium">
                    {detectedLanguage ? `${detectedLanguage} → Translated` : "Translation"}
                  </span>
                </div>
                <Button
                  className="h-6 w-6 rounded-full p-0"
                  onClick={clearTranslation}
                  size="icon"
                  variant="ghost"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
              <p className="mb-3 max-h-32 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {translatedText}
              </p>
              <div className="flex gap-2">
                <Button
                  className="h-8 rounded-full text-xs"
                  onClick={applyTranslation}
                  size="sm"
                  variant="default"
                >
                  <Check data-icon="inline-start" />
                  Apply to document
                </Button>
                <Button
                  className="h-8 rounded-full bg-white text-xs"
                  onClick={async () => {
                    await navigator.clipboard.writeText(translatedText);
                    toast.success("Translation copied to clipboard.");
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <Copy data-icon="inline-start" />
                  Copy
                </Button>
              </div>
            </div>
          )}

          <BlockNote
            initialContent={initialServerContent}
            key={room.id}
            onContentChange={handleContentChangeWithAI}
            provider={provider}
            userInfo={userInfo}
          />
        </>
      )}
    </section>
  );
}
