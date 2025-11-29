"use client";

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function SidebarOption({
  id,
  href,
}: {
  id: string;
  href: string;
}) {
  const [data] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all text-sm
        ${
          isActive
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
      `}
    >
      <FileText
        className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}
      />
      <span className="truncate flex-1 text-left">
        {data?.title || "New Document"}
      </span>
    </Link>
  );
}
