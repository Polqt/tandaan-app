"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SidebarOption({
  href,
  title,
}: {
  id: string;
  href: string;
  title: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "bg-white text-stone-950 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
          : "text-stone-600 hover:bg-white/70 hover:text-stone-900",
      )}
      href={href}
    >
      <FileText
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-stone-900" : "text-stone-400",
        )}
      />
      <span className="truncate">{title || "Untitled Document"}</span>
    </Link>
  );
}
