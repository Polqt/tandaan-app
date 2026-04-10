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
        "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-white font-medium text-stone-950 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
          : "text-stone-500 hover:bg-white/60 hover:text-stone-900",
      )}
      href={href}
    >
      <FileText
        className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          isActive ? "text-stone-700" : "text-stone-300 group-hover:text-stone-500",
        )}
      />
      <span className="truncate">{title || "Untitled"}</span>
    </Link>
  );
}
