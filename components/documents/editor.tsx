"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState, useRef, memo } from "react";
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
};

const BlockNote = memo(function BlockNote({ doc, provider, userInfo }: EditorProps) {
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: userInfo,
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView className="min-h-screen" editor={editor} theme="light" />
    </div>
  );
});

export default function Editor() {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [userInfo, setUserInfo] = useState<{ name: string; color: string } | null>(null);
  
  // Get user info only once when component mounts
  const selfInfo = useSelf((i) => i.info);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && selfInfo) {
      setUserInfo({
        name: selfInfo.name || "Anonymous",
        color: stringToColor(selfInfo.email || "1"),
      });
      initializedRef.current = true;
    }
  }, [selfInfo]);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDocument(yDoc);
    setProvider(yProvider);

    return () => {
      yProvider?.destroy();
      yDoc?.destroy();
    };
  }, [room]);

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
            <BlockNote doc={document} provider={provider} userInfo={userInfo} />
          )}
        </div>
      </div>
    </div>
  );
}
