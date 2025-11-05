"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";

export default function CommensPanel() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState();

  const handleAddComment = async () => {};

  const handleResolve = async (commentId: string) => {};

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          Comments
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <div className="mt-6"></div>
      </SheetContent>
    </Sheet>
  );
}
