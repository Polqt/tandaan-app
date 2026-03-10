"use client";

import { Version } from "@/types/version";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getDocumentVersion } from "@/services/versions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { History } from "lucide-react";

function formatVersionTimestamp(value: Version["timeStamp"]) {
  if (value && typeof value === "object" && "toDate" in value) {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.valueOf())) {
    return parsed.toLocaleString();
  }

  return "Unknown timestamp";
}

export default function VersionHistory() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const loadVersions = async () => {
    const roomId = pathname.split("/").pop();
    if (!roomId) {
      toast.error("Open a document first to view history.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await getDocumentVersion(roomId);
      if (!result.success) {
        toast.error(result.error || "Unable to load document versions.");
        setVersions([]);
        return;
      }

      setVersions(result.versions);
    } catch (error) {
      console.error("Error loading versions: ", error);
      toast.error("Unable to load document versions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"default"} onClick={loadVersions}>
          <History className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[600px]">
        <SheetHeader className="border-b border-gray-600">
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            View and restore previous versions of this document.
          </SheetDescription>
        </SheetHeader>
        <div className="">
          {isLoading && <p>Loading versions...</p>}
          {versions.length === 0 && !isLoading ? (
            <p className="text-sm text-muted-foreground text-center mt-8">
              No previous versions found.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="rounded-md border border-gray-200 p-3 text-sm"
                >
                  <p className="font-medium">Version: {version.id}</p>
                  <p className="text-muted-foreground">
                    {formatVersionTimestamp(version.timeStamp)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
