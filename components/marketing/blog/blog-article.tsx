import { ArrowLeft, Link2, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import { BlogIllustrationDoodle } from "@/components/marketing/shared/sketch-primitives";
import type { BlogPost, BlogPostDetail } from "@/types/marketing";

type BlogArticleProps = {
  detail: BlogPostDetail;
  post: BlogPost;
};

export function BlogArticle({ detail, post }: BlogArticleProps) {
  return (
    <div className="bg-[#fbfbfa]">
      <article className="px-5 pb-20 pt-12">
        <div className="mx-auto max-w-4xl">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#1e1e22] ring-1 ring-slate-200 hover:bg-slate-50"
            href="/blog"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>

          <header className="mt-10 text-center">
            <p className="text-sm font-black uppercase tracking-wide text-[#1688e8]">
              {post.category}
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-[clamp(3rem,6vw,5.75rem)] font-black leading-[0.98] tracking-[-0.055em] text-[#1e1e22]">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-[#77777c]">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div className="mt-10 overflow-hidden rounded-[24px] bg-[#e4f2ff] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
            <div className="h-[20rem] md:h-[26rem]">
              <BlogIllustrationDoodle type={post.illustration} />
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_14rem]">
            <div className="rounded-[24px] bg-white p-6 ring-1 ring-slate-200 md:p-10">
              {detail.sections.map((section) => (
                <section
                  className="scroll-mt-28 border-b border-slate-200 py-8 last:border-b-0 last:pb-0 first:pt-0"
                  id={section.heading.toLowerCase().replaceAll(" ", "-")}
                  key={section.heading}
                >
                  <h2 className="text-3xl font-black tracking-[-0.035em] text-[#1e1e22]">
                    {section.heading}
                  </h2>
                  <div className="mt-5 flex flex-col gap-5">
                    {section.body.map((paragraph) => (
                      <p
                        className="text-lg leading-9 text-[#77777c]"
                        key={paragraph}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-5">
              <div className="rounded-[20px] bg-[#101116] p-5 text-white">
                <p className="text-sm font-black uppercase tracking-wide text-white/50">
                  Key takeaway
                </p>
                <p className="mt-4 text-base font-bold leading-7">
                  {detail.keyTakeaway}
                </p>
              </div>

              <div className="rounded-[20px] bg-white p-5 ring-1 ring-slate-200">
                <p className="text-sm font-black text-[#1e1e22]">
                  Share this article
                </p>
                <div className="mt-4 flex gap-2">
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
                      className="flex size-10 items-center justify-center rounded-full bg-[#f4f4f3] text-[#1e1e22] transition hover:bg-[#e4f2ff] hover:text-[#1688e8]"
                      href={item.href}
                      key={item.label}
                    >
                      <item.icon className="size-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <PublicFooter />
    </div>
  );
}
