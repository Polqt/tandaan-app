import { Link2, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import {
  BlogIllustrationDoodle,
  HandUnderline,
  SketchStar,
} from "@/components/marketing/shared/sketch-primitives";
import type { BlogPost, BlogPostDetail } from "@/types/marketing";

type BlogArticleProps = {
  detail: BlogPostDetail;
  post: BlogPost;
};

export function BlogArticle({ detail, post }: BlogArticleProps) {
  return (
    <div className="tandaan-page">
      <div className="sketch-grain pointer-events-none fixed inset-0 z-0 opacity-80" />
      <article className="sketch-shell relative z-10 grid gap-8 py-9 lg:grid-cols-[12rem_1fr_14rem]">
        <aside className="hidden lg:block">
          <div className="sketch-card sticky top-28 p-5">
            <p className="text-sm font-black text-[var(--color-sketch-ink)]">
              On this page
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {detail.sections.map((section) => (
                <a
                  className="text-xs font-semibold text-[var(--color-sketch-muted)] transition hover:text-[var(--color-sketch-blue)]"
                  href={`#${section.heading.toLowerCase().replaceAll(" ", "-")}`}
                  key={section.heading}
                >
                  {section.heading}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div>
          <header className="relative mx-auto max-w-3xl text-center">
            <SketchStar className="absolute -left-8 top-6 hidden lg:block" />
            <SketchStar className="absolute -right-8 top-14 hidden rotate-12 lg:block" />
            <h1 className="mx-auto max-w-[15ch] text-4xl font-black leading-[1.04] text-[var(--color-sketch-ink)] sm:text-5xl">
              {post.title.includes("Asynchronous") ? (
                <>
                  The Future of Team Collaboration is Human (and{" "}
                  <span className="relative inline-block">
                    Asynchronous
                    <HandUnderline className="-bottom-2 h-1.5" />
                  </span>
                  )
                </>
              ) : (
                post.title
              )}
            </h1>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--color-sketch-muted)]">
              <span className="flex size-8 items-center justify-center rounded-full border border-[var(--color-sketch-ink)] bg-[#f4d9c5] font-bold text-[var(--color-sketch-ink)]">
                {post.author[0]}
              </span>
              <span className="font-semibold text-[var(--color-sketch-ink)]">
                {post.author}
              </span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div className="mx-auto mt-8 h-[18rem] max-w-3xl">
            <BlogIllustrationDoodle type={post.illustration} />
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            {detail.sections.map((section) => (
              <section
                className="scroll-mt-28 py-6"
                id={section.heading.toLowerCase().replaceAll(" ", "-")}
                key={section.heading}
              >
                <h2 className="text-2xl font-black text-[var(--color-sketch-ink)]">
                  {section.heading}
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {section.body.map((paragraph, paragraphIndex) => {
                    const shouldHighlight =
                      section.heading === "Why async wins" &&
                      paragraphIndex === 1;

                    return (
                      <p
                        className="text-base leading-8 text-[var(--color-sketch-muted)]"
                        key={paragraph}
                      >
                        {shouldHighlight ? (
                          <span className="rounded-md bg-[var(--color-sketch-soft)] px-1.5 py-1 font-semibold text-[var(--color-sketch-ink)]">
                            {paragraph}
                          </span>
                        ) : (
                          paragraph
                        )}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="sketch-card my-8 p-6">
              <p className="font-hand text-2xl text-[var(--color-sketch-ink)]">
                Annotation
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-sketch-muted)]">
                In Tandaan.AI, this kind of highlight can become a comment,
                owner note, or replay marker so the reason behind the decision
                stays visible.
              </p>
            </section>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="sketch-sticky-note rotate-[2deg] p-5">
              <p className="mb-3 text-sm font-black text-[var(--color-sketch-ink)]">
                Key takeaway
              </p>
              <p className="text-sm leading-6 text-[var(--color-sketch-ink)]">
                {detail.keyTakeaway}
              </p>
            </div>

            <div className="mt-12">
              <p className="text-xs font-bold text-[var(--color-sketch-muted)]">
                Share this article
              </p>
              <div className="mt-3 flex gap-2">
                {[
                  {
                    href: "https://twitter.com",
                    icon: Twitter,
                    label: "Share on X",
                  },
                  {
                    href: "https://www.linkedin.com",
                    icon: Linkedin,
                    label: "Share on LinkedIn",
                  },
                  {
                    href: `/blog/${post.slug}`,
                    icon: Link2,
                    label: "Copy link",
                  },
                ].map((item) => (
                  <Link
                    aria-label={item.label}
                    className="flex size-9 items-center justify-center rounded-md border border-[var(--color-sketch-line)] bg-white text-[var(--color-sketch-ink)] transition hover:border-[var(--color-sketch-blue)] hover:text-[var(--color-sketch-blue)]"
                    href={item.href}
                    key={item.label}
                  >
                    <item.icon className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </article>
      <div className="relative z-10">
        <PublicFooter />
      </div>
    </div>
  );
}
