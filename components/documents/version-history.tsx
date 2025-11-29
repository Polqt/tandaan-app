"use client";

import { Version } from "@/types/version";
import React, { useState, useTransition } from "react";
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
import { getUserDocuments } from "@/services/actions";

export default function VersionHistory() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadVersions = async () => {
    setIsLoading(true);

    try {
      const docs = await getUserDocuments(userId);
    } catch (error) {
      console.error("Error loading versions: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {};

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
            <>
              {versions.map((version) => (
                <div></div>
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
