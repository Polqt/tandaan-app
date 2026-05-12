"use client";

import { useMemo, useState } from "react";
import type { BlogCategory, BlogPost } from "@/types/marketing";

type UseBlogFiltersArgs = {
  posts: readonly BlogPost[];
};

export function useBlogFilters({ posts }: UseBlogFiltersArgs) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "All">(
    "All",
  );

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") {
      return posts;
    }

    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory, posts]);

  return {
    activeCategory,
    filteredPosts,
    setActiveCategory,
  };
}
