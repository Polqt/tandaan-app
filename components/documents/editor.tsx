"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState, useRef, memo, useCallback } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import DeleteDocument from "./delete-document";
import InviteUser from "../user/invite-user";
import CommentsPanel from "../documents/comments-panel";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  userInfo: {
    name: string;
    color: string;
  };
  onContentChange: (content: string) => void;
};

const BlockNote = memo(function BlockNote({ doc, provider, userInfo, onContentChange }: EditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: userInfo,
    },
  });

  useEffect(() => {
    const handleChange = () => {
      const content = JSON.stringify(editor.document);
      onContentChange(content);
    };

    const fragment = doc.getXmlFragment("document-store");
    fragment.observeDeep(handleChange);

    return () => {
      fragment.unobserveDeep(handleChange);
    };
  }, [doc, editor, onContentChange]);

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView className="min-h-screen" editor={editor} theme="light" />
    </div>
  );
});

export default function Editor() {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; color: string } | null>(null);
  const selfInfo = useSelf((i) => i.info);
  const initializedRef = useRef(false);
  const providerRef = useRef<LiveblocksYjsProvider | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    }
  }, []);

  useEffect(() => {
    if (docRef.current) return;

    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    
    docRef.current = yDoc;
    providerRef.current = yProvider;
    
    setDocument(yDoc);
    setProvider(yProvider);

    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }
      if (docRef.current) {
        docRef.current.destroy();
        docRef.current = null;
      }
      setDocument(null);
      setProvider(null);
    };
  }, [room]);

  // Debounced save to Firebase
  const handleContentChange = useCallback((content: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/documents/${room.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }, 1000);
  }, [room.id]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    }
  }, [])


  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 justify-end mb-10 sticky top-0 bg-background/95 backdrop-blur py-4 z-10">
            <CommentsPanel />
            <DeleteDocument />
            <InviteUser />
          </div>

          {document && provider && userInfo && (
            <BlockNote 
              doc={document} 
              provider={provider} 
              userInfo={userInfo} 
              onContentChange={handleContentChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
