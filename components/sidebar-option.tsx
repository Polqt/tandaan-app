"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SidebarOption({
  id,
  href,
  title
}: {
  id: string;
  href: string;
  title: string;
}) {
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";
  const [docs, setDocs] = useState([])

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents`);
        const json = await response.json();
        setDocs(json.documents);
      } catch (error) {
        console.error("Error fetching document data: ", error);
      }
    };
    fetchDocument()
  }, []);

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
      <span className="truncate flex-1 text-left">{title ?? "New Document"}</span>
    </Link>
  );
}
