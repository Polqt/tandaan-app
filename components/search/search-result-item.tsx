"use client";

import { ArrowRight, Clock, FileText } from "lucide-react";

export default function SearchResultItem({
  createdAt,
  onClick,
  title,
}: {
  createdAt?: string;
  onClick: () => void;
  title: string;
}) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "Recently updated";

  return (
    <button
      className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-[#efeee9]"
      onClick={onClick}
      type="button"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded bg-[#eeede8]">
        <FileText className="size-5 text-es-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-es-ink">{title}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-es-muted">
          <Clock className="size-3" />
          {formattedDate}
        </p>
      </div>
      <ArrowRight className="size-4 text-es-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
