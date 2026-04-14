import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { importPage } from "nextra/pages";
import { BookOpen, ChevronRight, FileCode2, Terminal } from "lucide-react";

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
      <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#e7e7e2] bg-[#f4f4f0]/90 px-4 py-2.5">
          <div className="flex items-center gap-2 text-es-ink">
            <Terminal className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">
              Developer Documentation
            </p>
          </div>
          <Link
            href="/documents"
            className="text-xs font-medium text-es-primary hover:text-es-ink"
          >
            Open App
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#e7e7e2] bg-[#f4f4f0] p-3">
              <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-es-muted">
                Navigation
              </p>
              <div className="space-y-1">
                {docsSidebar.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                      currentPath === item.href
                        ? "bg-es-canvas font-semibold text-es-ink"
                        : "text-[#6f6e6a] hover:bg-[#eeede8] hover:text-es-ink"
                    }`}
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#e7e7e2] bg-es-canvas p-3 text-xs text-[#6f6e6a]">
              <div className="mb-2 flex items-center gap-2 font-medium text-es-ink">
                <FileCode2 className="h-3.5 w-3.5" />
                For developers
              </div>
              API-first references, integrations, and implementation guides.
            </div>
          </aside>

          <div className="min-w-0">
            <section className="mb-6">
              <div className="flex items-center gap-2 text-es-primary">
                <BookOpen className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                  Docs
                </p>
              </div>
              <h1 className="mt-2 text-balance font-display text-4xl font-bold tracking-tight text-es-ink md:text-5xl">
                {metadata?.title ?? "Tandaan Docs"}
              </h1>
              {metadata?.description ? (
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#6f6e6a]">
                  {metadata.description}
                </p>
              ) : null}
            </section>

            <article className="rounded-2xl border border-[#e7e7e2] bg-es-canvas px-6 py-7 md:px-8">
              <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-[#2f3430] prose-p:text-[15px] prose-p:leading-7 prose-li:text-[15px] prose-code:rounded prose-code:bg-[#f4f4f0] prose-code:px-1.5 prose-code:py-0.5 prose-pre:rounded-xl prose-pre:border prose-pre:border-[#232323] prose-pre:bg-[#101010]">
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
