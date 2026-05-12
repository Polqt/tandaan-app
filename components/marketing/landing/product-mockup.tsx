import {
  Bell,
  Check,
  FileText,
  Heart,
  Inbox,
  LayoutGrid,
  Search,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  AvatarCluster,
  BrandWordmark,
  HandUnderline,
  SketchStar,
} from "@/components/marketing/shared/sketch-primitives";
import { cn } from "@/lib/utils";

type ProductMockupProps = {
  className?: string;
  compact?: boolean;
};

const sidebarItems = [
  { icon: Search, label: "Search" },
  { icon: Inbox, label: "Inbox" },
  { active: true, icon: FileText, label: "Documents" },
  { icon: Share2, label: "Shared with me" },
  { icon: Heart, label: "Favorites" },
  { icon: LayoutGrid, label: "Templates" },
  { icon: Trash2, label: "Trash" },
];

const spaces = [
  { color: "#ff6767", label: "Product" },
  { color: "#ffd35a", label: "Marketing" },
  { color: "#5168f6", label: "Design" },
  { color: "#2ea7b0", label: "General" },
];

const activityItems = [
  "Aira added a comment",
  "Sam edited a section",
  "Jepoy added Marketing Ideas",
  "Aira joined",
];

const goals = ["Launch beta in Q3", "Improve onboarding flow"];
const ideas = ["Content series", "Product hunt launch", "Partnerships"];

export function ProductMockup({
  className,
  compact = false,
}: ProductMockupProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[45rem]", className)}>
      <div className="sketch-window overflow-hidden rounded-[10px] border-[1.5px] border-[var(--color-sketch-ink)] bg-white shadow-[0_20px_50px_rgba(20,24,40,0.10)] dark:bg-slate-950">
        <div
          className={cn(
            "grid md:grid-cols-[11.5rem_1fr_11rem]",
            compact ? "min-h-[22rem]" : "min-h-[26rem]",
          )}
        >
          <aside className="hidden border-r border-[var(--color-sketch-line)] bg-[var(--color-sketch-soft)]/60 p-5 md:block dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <BrandWordmark className="text-[1.15rem]" />
              <LayoutGrid className="size-4 text-[var(--color-sketch-muted)]" />
            </div>
            <nav className="mt-7 flex flex-col gap-1.5">
              {sidebarItems.map((item) => (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px]",
                    item.active
                      ? "bg-[var(--color-sketch-blue)]/12 text-[var(--color-sketch-blue)]"
                      : "text-[var(--color-sketch-muted)]",
                  )}
                  key={item.label}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </div>
              ))}
            </nav>
            <p className="mt-8 text-[10px] font-bold uppercase text-[var(--color-sketch-muted)]">
              Spaces
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              {spaces.map((space) => (
                <div
                  className="flex items-center gap-2 text-[12px] text-[var(--color-sketch-muted)]"
                  key={space.label}
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: space.color }}
                  />
                  {space.label}
                </div>
              ))}
            </div>
          </aside>

          <section className="relative p-5 pb-20 sm:p-7 sm:pb-20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[var(--color-sketch-ink)]">
                Project Plan
              </h2>
              <div className="flex items-center gap-3">
                <AvatarCluster />
                <button
                  className="rounded-md bg-[var(--color-sketch-blue)] px-3 py-1.5 text-xs font-bold text-white"
                  type="button"
                >
                  Share
                </button>
              </div>
            </div>

            <div className="mt-7 grid gap-8 sm:grid-cols-[1fr_10rem]">
              <div>
                <p className="text-sm font-bold text-[var(--color-sketch-ink)]">
                  Goals
                </p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-sketch-ink)]">
                  {goals.map((goal) => (
                    <div className="flex items-center gap-2" key={goal}>
                      <Check className="size-4 text-[var(--color-sketch-blue)]" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-sm font-bold text-[var(--color-sketch-ink)]">
                  Marketing Ideas
                </p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-sketch-ink)]">
                  {ideas.map((idea, index) => (
                    <div className="flex items-center gap-2" key={idea}>
                      <Check className="size-4 text-[var(--color-sketch-ink)]" />
                      <span>{idea}</span>
                      {index === 2 ? (
                        <span className="-rotate-3 rounded bg-[var(--color-sketch-blue)] px-2 py-0.5 text-xs font-bold text-white">
                          Jepoy
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sketch-sticky-note -rotate-3 self-start p-4">
                <p className="font-hand text-lg leading-6 text-[var(--color-sketch-ink)]">
                  Let's add user testing here!
                </p>
                <Heart className="ml-auto mt-3 size-5 text-[var(--color-sketch-ink)]" />
              </div>
            </div>

            <div className="mock-cursor mock-cursor-a">
              <span>Aira</span>
            </div>
            <div className="mock-cursor mock-cursor-b">
              <span>Sam</span>
            </div>
            <div className="absolute bottom-14 left-7 flex items-center gap-2 rounded-md border border-[var(--color-sketch-line)] bg-white px-3 py-2 text-[11px] font-semibold text-[var(--color-sketch-muted)] shadow-sm dark:bg-slate-900">
              <span className="typing-dot" />
              <span>Aira is editing...</span>
            </div>

            <div className="absolute inset-x-5 bottom-4 flex items-center justify-between border-t border-[var(--color-sketch-line)] pt-3 text-[11px] text-[var(--color-sketch-muted)]">
              <span>Autosaved</span>
              <span>Last saved 2 min ago</span>
            </div>
          </section>

          <aside className="hidden border-l border-[var(--color-sketch-line)] p-5 md:block">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--color-sketch-ink)]">
                Activity
              </p>
              <Bell className="size-4 text-[var(--color-sketch-muted)]" />
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {activityItems.map((item, index) => (
                <div className="flex gap-2 text-[11px]" key={item}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-sketch-ink)] bg-[var(--color-sketch-soft)] font-bold text-[var(--color-sketch-ink)]">
                    {item[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--color-sketch-ink)]">
                      {item}
                    </p>
                    <p className="text-[var(--color-sketch-muted)]">
                      {index + 2}m ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-sketch-blue)]"
              href="/product"
            >
              View all
              <Sparkles className="size-3" />
            </Link>
          </aside>
        </div>
      </div>

      {!compact ? (
        <>
          <div className="absolute -bottom-16 left-[18%] hidden md:block">
            <div className="relative font-hand text-2xl leading-7 text-[var(--color-sketch-ink)]">
              Live collaboration
              <br />
              <span className="relative inline-block">
                that feels natural.
                <HandUnderline className="-bottom-2 h-1.5 bg-[var(--color-sketch-teal)]" />
              </span>
            </div>
            <svg
              aria-hidden="true"
              className="absolute -left-16 -top-8 h-24 w-16 text-[var(--color-sketch-teal)]"
              fill="none"
              viewBox="0 0 80 120"
            >
              <path
                d="M71 106C32 101 10 76 13 38"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d="m7 45 8-14 8 14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </div>
          <SketchStar className="absolute -bottom-12 right-[29%] hidden text-[var(--color-sketch-ink)] md:block" />
        </>
      ) : null}
    </div>
  );
}
