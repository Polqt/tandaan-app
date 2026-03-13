import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { importPage } from "nextra/pages";
import { ArrowLeft, Calendar, PenTool } from "lucide-react";

type BlogRouteProps = {
  params: Promise<{
    mdxPath?: string[];
  }>;
};

function toBlogPathSegments(mdxPath?: string[]) {
  return mdxPath?.length ? ["blog", ...mdxPath] : ["blog"];
}

export async function generateMetadata(
  props: BlogRouteProps,
): Promise<Metadata> {
  const params = await props.params;

  try {
    const { metadata } = await importPage(toBlogPathSegments(params.mdxPath));
    return {
      description: metadata?.description,
      title: metadata?.title,
    };
  } catch {
    return {};
  }
}

export default async function BlogPage(props: BlogRouteProps) {
  const params = await props.params;
  const isIndex = !params.mdxPath?.length;

  try {
    const { default: MDXContent, metadata } = await importPage(
      toBlogPathSegments(params.mdxPath),
    );

    return (
      <div className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
        {/* Back link for articles */}
        {!isIndex && (
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>
        )}

        {/* Header */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-coral">
            <PenTool className="h-4 w-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              Blog
            </p>
          </div>
          <h1 className="font-display mt-4 text-balance text-4xl font-bold tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
            {metadata?.title ?? "Tandaan Blog"}
          </h1>
          {metadata?.description ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
              {metadata.description}
            </p>
          ) : null}
          {!isIndex && (
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Product team
              </span>
            </div>
          )}

          {/* Nav pills for index */}
          {isIndex && (
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {[
                { label: "Product", href: "/" },
                { label: "Pricing", href: "/pricing" },
                { label: "Docs", href: "/docs" },
              ].map((link) => (
                <Link
                  key={link.label}
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Article body */}
        <article className="rounded-4xl border border-white/60 bg-white/80 px-7 py-8 shadow-sm backdrop-blur-sm md:px-10">
          <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-[15px] prose-p:leading-8 prose-li:text-[15px] prose-a:font-medium prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-800 prose-pre:bg-[#0b1120] prose-blockquote:border-coral/40 prose-blockquote:text-slate-600">
            <MDXContent
              params={{ mdxPath: toBlogPathSegments(params.mdxPath) }}
            />
          </div>
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
