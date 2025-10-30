"use client";

import Document from "@/components/document";
import React from "react";

export default function DocumentPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
    </div>
  );
}
