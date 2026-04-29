import { ArrowRight, BookOpenCheck, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import { blogPosts } from "@/lib/marketing/site-content";

export const metadata: Metadata = {
  title: "Blog | Tandaan",
  description:
    "Product notes and playbooks for collaborative writing, replay, and decision context.",
};

export default function BlogPage() {
  return (
    <div className="public-page">
      <div className="paper-grain pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="relative z-10">
        <section className="public-shell py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.02] text-(--color-paper-ink) sm:text-6xl">
                Stories, lessons, and ideas
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-(--color-paper-muted) sm:text-xl sm:leading-9">
              Notes on collaborative writing, replay-driven review, and how
              teams keep context alive after the meeting ends.
            </p>
          </div>
        </section>

        <section className="public-torn-section py-16 lg:py-24">
          <div className="public-shell grid gap-5 md:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Link
                href={`/blog/${post.slug}`}
                className="paper-panel block min-h-[22rem] p-5"
                key={post.slug}
              >
                <div className="flex h-36 items-center justify-center border border-(--color-paper-line) bg-[#f7e8cf]">
                  {index === 0 ? (
                    <BookOpenCheck className="size-12 text-paper-blue" />
                  ) : (
                    <FileText className="size-12 text-(--color-paper-ink)" />
                  )}
                </div>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-(--color-paper-soft)">
                  {post.category} - {post.date} - {post.readTime}
                </p>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-(--color-paper-ink)">
                  {post.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
                  {post.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-(--color-paper-ink)">
                  Read note
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  );
}
