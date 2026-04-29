import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicFooter from "@/components/marketing/shared/public-footer";
import {
  type BlogPostSlug,
  blogPostDetails,
  blogPosts,
} from "@/lib/marketing/site-content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};

  return {
    description: post.description,
    title: `${post.title} | Tandaan Blog`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  const detail = blogPostDetails[slug as BlogPostSlug];

  if (!post || !detail) {
    notFound();
  }

  return (
    <div className="public-page">
      <div className="paper-grain pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="relative z-10">
        <article className="public-shell py-14 lg:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-(--color-paper-ink) underline decoration-paper-red decoration-2 underline-offset-8"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>

          <header className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div className="paper-note bg-[#fff1b8]">
              <p className="font-hand text-3xl leading-8 text-(--color-paper-ink)">
                {post.category}
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-(--color-paper-soft)">
                {post.date} - {post.readTime}
              </p>
            </div>
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.03] text-(--color-paper-ink) sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-(--color-paper-muted) sm:text-xl sm:leading-9">
                {post.description}
              </p>
            </div>
          </header>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="hidden lg:block">
              <div className="paper-panel sticky top-24 p-5">
                <p className="font-hand text-3xl text-(--color-paper-ink)">
                  In this note
                </p>
                <div className="mt-5 space-y-3">
                  {detail.sections.map((section) => (
                    <a
                      className="block text-sm font-bold text-(--color-paper-muted) hover:text-(--color-paper-red)"
                      href={`#${section.heading.toLowerCase().replaceAll(" ", "-")}`}
                      key={section.heading}
                    >
                      {section.heading}
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            <div className="paper-ledger space-y-10 p-6 sm:p-8">
              {detail.sections.map((section) => (
                <section
                  id={section.heading.toLowerCase().replaceAll(" ", "-")}
                  key={section.heading}
                >
                  <h2 className="text-3xl font-bold text-(--color-paper-ink)">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5">
                    {section.body.map((paragraph) => (
                      <p
                        className="text-lg leading-9 text-(--color-paper-muted)"
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
              <Link
                href="/documents"
                className="inline-flex items-center gap-2 text-sm font-bold text-(--color-paper-ink) underline decoration-paper-blue decoration-2 underline-offset-8"
              >
                Try this in Tandaan
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </article>
        <PublicFooter />
      </div>
    </div>
  );
}
