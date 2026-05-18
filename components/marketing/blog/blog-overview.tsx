"use client";

import { ArrowRight, FolderOpen, Hash, Search } from "lucide-react";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import { BlogIllustrationDoodle } from "@/components/marketing/shared/sketch-primitives";
import { Button } from "@/components/ui/button";
import { useBlogFilters } from "@/hooks/marketing/use-blog-filters";
import { cn } from "@/lib/utils";
import type { BlogCategory, BlogPost } from "@/types/marketing";

type BlogOverviewProps = {
  categories: readonly BlogCategory[];
  posts: readonly BlogPost[];
  tags: readonly string[];
};

export function BlogOverview({ categories, posts, tags }: BlogOverviewProps) {
  const { activeCategory, filteredPosts, setActiveCategory } = useBlogFilters({
    posts,
  });
  const featuredPost =
    filteredPosts.find((post) => post.featured) ?? filteredPosts[0];
  const articlePosts = filteredPosts.filter(
    (post) => post.slug !== featuredPost?.slug,
  );

  return (
    <div className="bg-[#fbfbfa]">
      <section className="px-5 pb-14 pt-14 md:pt-18">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-[clamp(3.5rem,7vw,6.5rem)] font-black leading-[0.95] tracking-[-0.055em] text-[#1e1e22]">
              Blog
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#77777c]">
              Product notes, collaboration playbooks, and design essays from the
              Tandaan.AI team.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <FilterButton
              active={activeCategory === "All"}
              label="All"
              onClick={() => setActiveCategory("All")}
            />
            {categories.map((category) => (
              <FilterButton
                active={activeCategory === category}
                key={category}
                label={category}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>

          {featuredPost ? (
            <Link
              className="group mt-12 grid overflow-hidden rounded-[24px] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 transition hover:-translate-y-1 md:grid-cols-[1fr_0.82fr]"
              href={`/blog/${featuredPost.slug}`}
            >
              <div className="p-7 md:p-10">
                <p className="text-sm font-black uppercase tracking-wide text-[#1688e8]">
                  Featured Article
                </p>
                <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#1e1e22] md:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#77777c]">
                  {featuredPost.description}
                </p>
                <PostMeta post={featuredPost} />
                <span className="mt-7 inline-flex items-center gap-2 text-base font-black text-[#1688e8]">
                  Read article
                  <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </span>
              </div>
              <div className="min-h-72 bg-[#e4f2ff] p-5">
                <BlogIllustrationDoodle type={featuredPost.illustration} />
              </div>
            </Link>
          ) : null}

          <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2">
            {articlePosts.map((post) => (
              <Link
                className="group block"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <div className="aspect-[1.78] overflow-hidden rounded-[18px] bg-[#f4f4f3] p-5 ring-1 ring-slate-200 transition group-hover:-translate-y-1 group-hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                  <BlogIllustrationDoodle type={post.illustration} />
                </div>
                <PostMeta compact post={post} />
                <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-[#1e1e22]">
                  {post.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-[#77777c]">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-[24px] bg-white p-6 ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <Search className="mr-2 size-5 text-[#1688e8]" />
              {tags.map((tag) => (
                <span
                  className="rounded-full bg-[#f4f4f3] px-3 py-1.5 text-sm font-bold text-[#77777c]"
                  key={tag}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      className={cn(
        "h-11 rounded-full px-4 text-sm font-extrabold",
        active
          ? "bg-[#101116] text-white hover:bg-[#24252c]"
          : "bg-white text-[#1e1e22] ring-1 ring-slate-200 hover:bg-slate-50",
      )}
      onClick={onClick}
      type="button"
    >
      <FolderOpen data-icon="inline-start" />
      {label}
    </Button>
  );
}

function PostMeta({
  compact = false,
  post,
}: {
  compact?: boolean;
  post: BlogPost;
}) {
  return (
    <div
      className={cn(
        "mt-5 flex flex-wrap items-center gap-3 text-sm font-bold text-[#77777c]",
        compact && "mt-4",
      )}
    >
      <span>{post.date}</span>
      <span>{post.category}</span>
      <span className="inline-flex items-center gap-1">
        <Hash className="size-3.5" />
        {post.readTime}
      </span>
    </div>
  );
}
