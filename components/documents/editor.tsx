"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
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
};

function BlockNote({ doc, provider }: EditorProps) {
  const userInfo = useSelf((i) => i.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name || "Anonymous",
        color: stringToColor(userInfo?.email || "1"),
      },
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView className="min-h-screen" editor={editor} />
    </div>
  );
}

export default function Editor() {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
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

          {document && provider && (
            <BlockNote doc={document} provider={provider} />
          )}
        </div>
      </div>
    </div>
  );
}
