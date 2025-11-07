"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

export default function TemplateDialog() {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCreateFromTemplate = (templateId: string) => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Use Template</Button>
        Use Template
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-designed template to quickly create your document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 mt-4"></div>
      </DialogContent>
    </Dialog>
  );
}
