"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/stringToColor";
import DeleteDocument from "./delete-document";
import InviteUser from "./invite-user";

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
        color: stringToColor(userInfo?.email),
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        <DeleteDocument />
        <InviteUser />
        <Button
          className={
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {document && provider && (
        <BlockNote doc={document} provider={provider} darkMode={darkMode} />
      )}
    </div>
  );
}
