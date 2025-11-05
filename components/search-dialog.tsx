"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "@/firebase";
import { Input } from "./ui/input";
import SearchResultItem from "./search-result-item";

export default function SearchDialog() {
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [data] = useCollection(
    user && collection(db, "users", user.id, "rooms"),
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredDocs = data?.docs.filter((doc) => {
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Search className="w-4 h-4 mr-2" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Input
            placeholder="search docucments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-base"
            autoFocus
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {!query ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              <p>start typing to search documents</p>
            </div>
          ) : filteredDocs && filteredDocs.length > 0 ? (
            <div className="space-y-1">
              {filteredDocs.map((doc) => (
                <SearchResultItem
                  key={doc.id}
                  docId={doc.id}
                  query={query}
                  onClick={() => {
                    router.push(`/documents/${doc.id}`);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              <p>no documents found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
