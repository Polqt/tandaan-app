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
import { LoaderCircle } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import stringToColor from "@/lib/stringToColor";
import { cn } from "@/lib/utils";
import CommentsPanel from "./comments-panel";
import DeleteDocument from "./delete-document";

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
      className="min-h-[calc(100vh-20rem)] [&_.bn-container]:border-0 [&_.bn-editor]:bg-transparent [&_.bn-editor]:px-8 [&_.bn-editor]:py-8 [&_.bn-editor]:text-[15px] [&_.bn-editor]:text-stone-800"
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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

      const response = await fetch(`/api/documents/${room.id}/versions`, {
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
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

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/documents/${room.id}`, {
            body: JSON.stringify({ content }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
          });

          if (!response.ok) {
            throw new Error("Failed to save document");
          }

          await createSnapshot(content);
        } catch (error) {
          console.error("Error saving document:", error);
          toast.error("Failed to save document. Changes may be lost.");
        }
      }, DOCUMENT_SAVE_DELAY_MS);
    },
    [createSnapshot, room.id],
  );

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#ebe9e6] bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <div className="flex flex-col gap-4 border-b border-[#f1efeb] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              isSynced ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
          <span>{isSynced ? "Live and synced" : "Syncing room state..."}</span>
        </div>

        <div className="flex items-center gap-1">
          <CommentsPanel />
          <DeleteDocument />
        </div>
      </div>

      {!userInfo ? (
        <div className="flex min-h-[calc(100vh-20rem)] items-center justify-center text-sm text-stone-500">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Loading editor...
        </div>
      ) : (
        <BlockNote
          key={room.id}
          onContentChange={handleContentChange}
          provider={provider}
          userInfo={userInfo}
        />
      )}
    </section>
  );
}
