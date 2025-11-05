"use client";

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { ArrowRight, Clock, FileText } from "lucide-react";

export default function SearchResultItem({
  docId,
  query,
  onClick,
}: {
  docId: string;
  query: string;
  onClick: () => void;
}) {
  const [data] = useDocumentData(doc(db, "documents", docId));

  if (!data || !data.title.toLowerCase().includes(query.toLowerCase())) {
    return null;
  }
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group"
    >
      <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
          {data.title}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
