"use client";

import { useState } from "react";
import type { ProductTabId } from "@/types/marketing";

export function useProductTab(defaultTab: ProductTabId = "collaboration") {
  const [activeTab, setActiveTab] = useState<ProductTabId>(defaultTab);

  return {
    activeTab,
    setActiveTab,
  };
}
