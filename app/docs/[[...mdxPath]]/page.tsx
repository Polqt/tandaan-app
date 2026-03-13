import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { importPage } from "nextra/pages";
import {
  BookOpen,
  ChevronRight,
  FileText,
  Zap,
} from "lucide-react";

type DocsRouteProps = {
  params: Promise<{
    mdxPath?: string[];
  }>;
};

function toDocsPathSegments(mdxPath?: string[]) {
  return mdxPath?.length ? ["docs", ...mdxPath] : ["docs"];
}

const docsSidebar = [
  { title: "Overview", href: "/docs" },
  { title: "Getting Started", href: "/docs/getting-started" },
  { title: "Replay API", href: "/docs/replay-api" },
  { title: "Timeline Query", href: "/docs/timeline-query" },
];

export async function generateMetadata(
  props: DocsRouteProps,
): Promise<Metadata> {
  const params = await props.params;

  try {
    const { metadata } = await importPage(toDocsPathSegments(params.mdxPath));
    return {
      description: metadata?.description,
      title: metadata?.title,
    };
  } catch {
    return {};
  }
}

export default async function DocsPage(props: DocsRouteProps) {
  const params = await props.params;
  const currentPath = params.mdxPath?.length
    ? `/docs/${params.mdxPath.join("/")}`
    : "/docs";

  try {
    const { default: MDXContent, metadata } = await importPage(
      toDocsPathSegments(params.mdxPath),
    );

    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Documentation
              </p>
              {docsSidebar.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                    currentPath === item.href
                      ? "bg-cobalt-light/60 font-semibold text-cobalt"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {currentPath === item.href ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  {item.title}
                </Link>
              ))}

              <div className="mt-6 rounded-2xl border border-cobalt/20 bg-cobalt-light/40 p-4">
                <div className="flex items-center gap-2 text-cobalt">
                  <Zap className="h-4 w-4" />
                  <p className="text-xs font-bold">Quick links</p>
                </div>
                <div className="mt-3 space-y-1.5">
                  <Link
                    href="/blog"
                    className="block text-xs text-slate-500 transition hover:text-slate-800"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/pricing"
                    className="block text-xs text-slate-500 transition hover:text-slate-800"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {/* Mobile nav pills */}
            <div className="mb-6 flex flex-wrap gap-2 text-sm lg:hidden">
              {docsSidebar.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                    currentPath === item.href
                      ? "border-cobalt/30 bg-cobalt-light/60 text-cobalt"
                      : "border-slate-200 bg-white/80 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Header */}
            <section className="mb-8">
              <div className="flex items-center gap-2 text-cobalt">
                <BookOpen className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Docs
                </p>
              </div>
              <h1 className="font-display mt-3 text-balance text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                {metadata?.title ?? "Tandaan Docs"}
              </h1>
              {metadata?.description ? (
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                  {metadata.description}
                </p>
              ) : null}
            </section>

            {/* Article */}
            <article className="rounded-[2rem] border border-white/60 bg-white/80 px-7 py-8 shadow-sm backdrop-blur-sm md:px-10">
              <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-[15px] prose-p:leading-7 prose-li:text-[15px] prose-a:font-medium prose-a:text-cobalt prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-800 prose-pre:bg-[#0b1120]">
                <MDXContent
                  params={{ mdxPath: toDocsPathSegments(params.mdxPath) }}
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
