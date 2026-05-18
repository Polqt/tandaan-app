import { ArrowRight, Check, CirclePlay } from "lucide-react";
import Link from "next/link";
import { WorkspaceMockup } from "@/components/marketing/landing/workspace-mockup";
import { Button } from "@/components/ui/button";

const trustItems = ["Live cursors", "Replay links", "Private rooms"] as const;

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#faf9f6]">
      <div className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-6xl flex-col justify-center px-5 pb-0 pt-16 md:pt-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-[#555]">
            <span className="size-2 rounded-full bg-emerald-400" />
            Used by focused teams who need context to survive handoff
          </div>

          <h1 className="mt-8 text-[clamp(3.2rem,7vw,6.25rem)] font-black leading-[0.92] tracking-[-0.055em] text-[#1a1a1a]">
            Team documents that{" "}
            <em
              className="not-italic"
              style={{
                fontStyle: "italic",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                color: "#d4522a",
              }}
            >
              remember
            </em>
            <br />
            how work happened.
          </h1>

          <p className="mt-5 text-[clamp(1.4rem,2.8vw,1.85rem)] font-black leading-[1.1] tracking-[-0.03em] text-[#a0a0a0]">
            That your team will always come back to.
          </p>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#666]">
            Tandaan keeps writing, comments, decisions, and replay history inside
            one calm workspace. Understand{" "}
            <strong className="font-extrabold text-[#1a1a1a]">the story</strong>
            , not just the final draft.{" "}
            <em
              style={{
                fontStyle: "italic",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                color: "#d4522a",
              }}
            >
              Replay-ready.
            </em>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="h-[3.25rem] rounded-full bg-[#1a1a1a] px-8 text-base font-extrabold text-white hover:bg-[#333]"
            >
              <Link href="/sign-in">
                Start a workspace
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-[3.25rem] rounded-full border border-slate-200 bg-white px-6 text-base font-extrabold text-[#1a1a1a] hover:bg-slate-50"
              variant="outline"
            >
              <Link href="/blog/narrative-replays">
                <CirclePlay data-icon="inline-start" />
                See replay story
              </Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-bold text-[#555]">
            {trustItems.map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                  <Check className="size-3" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-16 w-full translate-y-6">
          <div className="absolute -inset-x-10 bottom-0 h-[8rem] bg-gradient-to-t from-[#faf9f6] to-transparent" />
          <div className="overflow-hidden rounded-t-[28px] border border-b-0 border-slate-200 bg-white shadow-[0_-8px_60px_rgba(0,0,0,0.06)]">
            <WorkspaceMockup className="rotate-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
