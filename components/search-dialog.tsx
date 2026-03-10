"use client";

import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRooms } from "@/hooks/useRooms";
import SearchResultItem from "./search-result-item";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";

export default function SearchDialog() {
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { data } = useRooms(Boolean(user?.id) && open);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((currentOpen) => !currentOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredRooms = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return (data?.rooms ?? []).filter((room) => {
      const title = room.document?.title?.toLowerCase() ?? "";
      return title.includes(normalizedQuery);
    });
  }, [data?.rooms, deferredQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 w-full justify-start rounded-xl border border-transparent px-3 text-stone-600 hover:border-[#e8e6e1] hover:bg-white hover:text-stone-900"
        >
          <Search className="mr-2 h-4 w-4 text-stone-400" />
          <span className="flex-1 text-left">Search</span>
          <Kbd className="pointer-events-none border border-[#e6e2dc] bg-[#fbfbfa] text-stone-500">
            Ctrl K
          </Kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-[24px] border border-[#ebe9e6] bg-white p-0">
        <div className="flex items-center border-b border-[#f1efeb] px-4 py-3">
          <Search className="mr-3 h-5 w-5 text-stone-400" />
          <Input
            autoFocus
            className="border-0 text-base focus-visible:ring-0"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your notes..."
            value={query}
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {!query ? (
            <div className="px-4 py-8 text-center text-sm text-stone-500">
              <p>Start typing to search documents.</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="space-y-1">
              {filteredRooms.map((room) => (
                <SearchResultItem
                  key={room.id}
                  createdAt={room.createdAt}
                  onClick={() => {
                    router.push(`/documents/${room.id}`);
                    setOpen(false);
                  }}
                  title={room.document?.title ?? "Untitled Document"}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-stone-500">
              <p>No documents found.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
