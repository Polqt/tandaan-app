"use client";

import { Version } from "@/types/version";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { History } from "lucide-react";

export default function VersionHistory() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadVersions = async () => {};

  const handleRestore = async (versionId: string) => {};

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"sm"} onClick={loadVersions}>
          <History className="w-4 h-4 mr-2" />
          Version History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription>
            View and restore previous versions of this document.
          </SheetDescription>
          <div className="mt-6 space-y-4">
            {isLoading && <p>Loading versions...</p>}
            {versions.length === 0 && !isLoading && (
              <p>No previous versions found.</p>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
