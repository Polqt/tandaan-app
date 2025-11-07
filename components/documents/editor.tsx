"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { MessageSquare, MoonIcon, SunIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import DeleteDocument from "./delete-document";
import InviteUser from "../user/invite-user";
import CommentsPanel  from "../documents/comments-panel";
import { cn } from "@/lib/utils";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: EditorProps) {
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
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default function Editor() {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);
  const [showComments, setShowComments] = useState(false);

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
      {/* Main Editor Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 justify-end mb-10 sticky top-0 bg-background/95 backdrop-blur py-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className={cn(showComments && "bg-accent")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </Button>
            <DeleteDocument />
            <InviteUser />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
          </div>

          {document && provider && (
            <BlockNote doc={document} provider={provider} darkMode={darkMode} />
          )}
        </div>
      </div>

      {/* Comments Sidebar */}
      {showComments && (
        <div className="w-80 border-l bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Comments</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CommentsPanel roomId={room.id} />
        </div>
      )}
    </div>
  );
}