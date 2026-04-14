"use client";

import type { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import {
  getYjsProviderForRoom,
  type LiveblocksYjsProvider,
} from "@liveblocks/yjs";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import stringToColor from "@/lib/stringToColor";
import { Spinner } from "../ui/spinner";

type EditorIdentity = {
  color: string;
  name: string;
};

type BlockNoteProps = {
  onContentChange: (content: string) => void;
  provider: LiveblocksYjsProvider;
  userInfo: EditorIdentity;
};

const DOCUMENT_SAVE_DELAY_MS = 1000;
const VERSION_SNAPSHOT_INTERVAL_MS = 30000;

function generateIdempotencyKey() {
  return crypto.randomUUID();
}

const BlockNote = memo(function BlockNote({
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

  const handleEditorChange = useCallback(() => {
    try {
      onContentChange(JSON.stringify(editor.document));
    } catch (error) {
      console.error("Error serializing document:", error);
    }
  }, [editor, onContentChange]);

  return (
    <BlockNoteView
      className="min-h-[calc(100vh-10.5rem)] [&_.bn-container]:border-0 [&_.bn-editor]:bg-transparent [&_.bn-editor]:px-0 [&_.bn-editor]:py-0 [&_.bn-editor]:text-[16px] [&_.bn-editor]:leading-[1.8] [&_.bn-editor]:text-[#2f3430] [&_.bn-editor]:caret-[#5f5e5e] [&_.bn-editor]:focus:outline-none [&_.bn-editor]:pt-2 [&_.bn-side-menu]:hidden [&_.bn-toolbar]:rounded-lg [&_.bn-toolbar]:border-0 [&_.bn-toolbar]:bg-[#f4f4f0]/90 [&_.bn-toolbar]:backdrop-blur-xl"
      editor={editor}
      onChange={handleEditorChange}
      theme="light"
    />
  );
});

export default function Editor() {
  const room = useRoom();
  const selfInfo = useSelf((self) => self.info);
  const provider = useMemo(() => getYjsProviderForRoom(room), [room]);
  const [isSynced, setIsSynced] = useState(provider.synced);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSaveControllerRef = useRef<AbortController | null>(null);
  const saveRevisionRef = useRef(0);
  const lastSavedContentRef = useRef("");
  const lastSnapshotAtRef = useRef(0);
  const lastSnapshotContentRef = useRef("");

  const userInfo = useMemo<EditorIdentity | null>(() => {
    if (!selfInfo) {
      return null;
    }

    const displayName = selfInfo.name || "Anonymous";
    const colorSeed = selfInfo.email || displayName;

    return {
      color: stringToColor(colorSeed),
      name: displayName,
    };
  }, [selfInfo]);

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
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      activeSaveControllerRef.current?.abort();
    };
  }, []);

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

      const idempotencyKey = generateIdempotencyKey();
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

      const revision = ++saveRevisionRef.current;

      saveTimeoutRef.current = setTimeout(async () => {
        if (revision !== saveRevisionRef.current) {
          return;
        }

        if (!content || content === lastSavedContentRef.current) {
          return;
        }

        activeSaveControllerRef.current?.abort();
        const controller = new AbortController();
        activeSaveControllerRef.current = controller;

        try {
          const idempotencyKey = generateIdempotencyKey();
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
            throw new Error("Failed to save document");
          }

          if (revision !== saveRevisionRef.current) {
            return;
          }

          lastSavedContentRef.current = content;
          await createSnapshot(content);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }

          console.error("Error saving document:", error);
          toast.error("Failed to save document. Changes may be lost.");
        } finally {
          if (activeSaveControllerRef.current === controller) {
            activeSaveControllerRef.current = null;
          }
        }
      }, DOCUMENT_SAVE_DELAY_MS);
    },
    [createSnapshot, room.id],
  );

  return (
    <section className="w-full">
      {!userInfo ? (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs tracking-wide text-[#8a8a87] uppercase">
              <Spinner className="size-3.5 text-[#5f5e5e]" />
              Loading editor
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#e6e9e4]">
              <div className="h-full w-2/3 rounded-full bg-[#5f5e5e] animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {!isSynced && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#e6e9e4] px-3 py-1.5 text-xs text-[#5f5e5e]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              Syncing...
            </div>
          )}
          <BlockNote
            key={room.id}
            onContentChange={handleContentChange}
            provider={provider}
            userInfo={userInfo}
          />
        </>
      )}
    </section>
  );
}
