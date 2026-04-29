"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SidebarOption({
  href,
  title,
}: {
  href: string;
  id: string;
  title: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
        isActive
          ? "border-l-2 border-es-ink bg-[#ecebe7] font-medium text-es-ink"
          : "text-es-muted hover:bg-[#efeee9] hover:text-es-ink",
      )}
      href={href}
    >
      <FileText
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          isActive
            ? "text-es-primary"
            : "text-[#bcb9b2] group-hover:text-es-muted",
        )}
      />
      <span className="truncate">{title || "Untitled"}</span>
    </Link>
  );
}
