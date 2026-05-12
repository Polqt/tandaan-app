import type { Metadata } from "next";
import { BlogOverview } from "@/components/marketing/blog/blog-overview";
import {
  blogCategories,
  blogPosts,
  popularTags,
} from "@/lib/marketing/site-content";

export const metadata: Metadata = {
  title: "Blog | Tandaan.AI",
  description:
    "Product notes and playbooks for async collaboration, knowledge management, and team culture.",
};

export default function BlogPage() {
  return (
    <BlogOverview
      categories={blogCategories}
      posts={blogPosts}
      tags={popularTags}
    />
  );
}
