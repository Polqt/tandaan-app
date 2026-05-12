"use client";

import {
  ArrowDown,
  ArrowRight,
  FolderOpen,
  Hash,
  NotebookText,
  Star,
} from "lucide-react";
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
    <div className="tandaan-page">
      <div className="sketch-grain pointer-events-none fixed inset-0 z-0 opacity-80" />
      <div className="relative z-10">
        <section className="sketch-shell py-10 lg:py-14">
          <div className="grid items-end gap-8 border-b border-[var(--color-sketch-line)] pb-8 lg:grid-cols-[1fr_17rem]">
            <div>
              <h1 className="max-w-[12ch] text-[clamp(3rem,6vw,5rem)] font-black leading-[1] text-[var(--color-sketch-ink)]">
                Notes for teams that think in public.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-sketch-muted)]">
                Product notes, collaboration playbooks, and design essays from
                the Tandaan.AI team.
              </p>
            </div>
            <div className="sketch-sticky-note rotate-[-2deg] p-5">
              <p className="font-hand text-2xl leading-7 text-[var(--color-sketch-ink)]">
                Fresh ideas, replayable decisions, fewer lost threads.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_16rem]">
            <div>
              {featuredPost ? (
                <Link
                  className="sketch-card group grid min-h-[19rem] overflow-hidden p-6 transition hover:-translate-y-1 hover:rotate-[-0.2deg] hover:shadow-[0_18px_42px_rgba(20,24,40,0.10)] md:grid-cols-[1fr_0.78fr]"
                  href={`/blog/${featuredPost.slug}`}
                >
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-black uppercase text-[var(--color-sketch-blue)]">
                      Featured Article
                    </p>
                    <h2 className="mt-4 max-w-[34rem] text-3xl font-black leading-tight text-[var(--color-sketch-ink)]">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 max-w-[38rem] text-base leading-7 text-[var(--color-sketch-muted)]">
                      {featuredPost.description}
                    </p>
                    <PostMeta post={featuredPost} />
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[var(--color-sketch-blue)]">
                      Read article
                      <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                  <div className="min-h-[13rem]">
                    <BlogIllustrationDoodle type={featuredPost.illustration} />
                  </div>
                </Link>
              ) : null}

              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {articlePosts.map((post, index) => (
                  <Link
                    className={cn(
                      "sketch-card group flex min-h-[17.5rem] flex-col p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(20,24,40,0.10)]",
                      index % 2 === 0
                        ? "hover:rotate-[-0.4deg]"
                        : "hover:rotate-[0.4deg]",
                    )}
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-md border border-[var(--color-sketch-line)] bg-white px-2.5 py-1.5 text-xs font-black text-[var(--color-sketch-blue)] dark:bg-slate-950">
                        {post.category}
                      </span>
                      <ArrowRight className="size-4 text-[var(--color-sketch-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--color-sketch-blue)]" />
                    </div>
                    <h2 className="mt-4 text-lg font-black leading-snug text-[var(--color-sketch-ink)]">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-sketch-muted)]">
                      {post.description}
                    </p>
                    <div className="mt-auto h-20">
                      <BlogIllustrationDoodle type={post.illustration} />
                    </div>
                    <PostMeta post={post} compact />
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  className="h-11 rounded-lg bg-transparent px-4 text-[var(--color-sketch-blue)] hover:bg-[var(--color-sketch-soft)]"
                  variant="ghost"
                >
                  <ArrowDown data-icon="inline-start" />
                  Load more articles
                </Button>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="sketch-card p-4">
                <div className="mb-4 flex items-center gap-2">
                  <NotebookText className="size-5 text-[var(--color-sketch-ink)]" />
                  <h2 className="font-hand text-2xl font-semibold text-[var(--color-sketch-ink)]">
                    Categories
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <button
                    className={cn(
                      "blog-filter-button",
                      activeCategory === "All" && "is-active",
                    )}
                    onClick={() => setActiveCategory("All")}
                    type="button"
                  >
                    <FolderOpen className="size-4" />
                    All Articles
                  </button>
                  {categories.map((category) => (
                    <button
                      className={cn(
                        "blog-filter-button",
                        activeCategory === category && "is-active",
                      )}
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      type="button"
                    >
                      <FolderOpen className="size-4" />
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sketch-card p-4">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="font-hand text-2xl font-semibold text-[var(--color-sketch-ink)]">
                    Popular Tags
                  </h2>
                  <Star className="size-5 text-[var(--color-sketch-ink)]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      className="rounded-md border border-[var(--color-sketch-line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[var(--color-sketch-muted)] dark:bg-slate-950"
                      key={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
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
        "mt-5 flex flex-wrap items-center gap-3 text-xs text-[var(--color-sketch-muted)]",
        compact && "pt-2",
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-full border border-[var(--color-sketch-ink)] bg-[#f4d9c5] font-bold text-[var(--color-sketch-ink)]">
        {post.author[0]}
      </span>
      <span className="font-semibold text-[var(--color-sketch-ink)]">
        {post.author}
      </span>
      <span>{post.date}</span>
      <span className="inline-flex items-center gap-1">
        <Hash className="size-3" />
        {post.readTime}
      </span>
    </div>
  );
}
