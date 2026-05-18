import {
  ArrowRight,
  CircleCheck,
  MessageSquareText,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { WorkspaceMockup } from "@/components/marketing/landing/workspace-mockup";
import { Button } from "@/components/ui/button";
import { landingFeatures, workflowSteps } from "@/lib/marketing/site-content";

const faqItems = [
  {
    answer:
      "Tandaan gives teams a shared writing room with live editing, comments, and replay history. It is built for decisions that need context later.",
    question: "What is Tandaan for?",
  },
  {
    answer:
      "The product stores meaningful document activity so teammates can inspect how a draft changed, why comments were resolved, and what decision path led to the final version.",
    question: "How does session replay help a document team?",
  },
  {
    answer:
      "Yes. Shared links are designed for stakeholders who need the story without full workspace access.",
    question: "Can I share only the useful part of the history?",
  },
  {
    answer:
      "Yes. Authentication, protected workspaces, and Firebase-backed deployment are already wired for production usage.",
    question: "Is this ready for a real workspace?",
  },
] as const;

export function LandingFeatureGrid() {
  return (
    <section className="bg-[#fbfbfa] px-5 py-20" id="features">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black leading-[1.02] tracking-[-0.045em] text-[#1e1e22] md:text-6xl">
            Same workspace. No context hunting.
          </h2>
          <p className="mt-5 text-xl leading-8 text-[#77777c]">
            Tandaan gives async teams the parts they usually rebuild in chat
            after every handoff.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {landingFeatures.map((feature) => (
            <article
              className="min-h-[14.5rem] rounded-[20px] bg-[#f4f4f3] p-7 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
              key={feature.title}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-white text-[#1688e8] shadow-sm">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-10 text-2xl font-black leading-tight tracking-[-0.02em] text-[#1e1e22]">
                {feature.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[#77777c]">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingWorkflow() {
  return (
    <section className="bg-white px-5 py-20" id="workflow">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-center">
        <div>
          <h2 className="text-5xl font-black leading-[1.02] tracking-[-0.045em] text-[#1e1e22] md:text-6xl">
            From messy draft to decision trail.
          </h2>
          <p className="mt-5 text-xl leading-8 text-[#77777c]">
            Start with a rough document. Invite the room. Let the work explain
            itself when someone comes back tomorrow.
          </p>
          <Button
            asChild
            className="mt-9 h-[3.25rem] rounded-full bg-[#101116] px-7 text-base font-extrabold text-white hover:bg-[#24252c]"
          >
            <Link href="/sign-in">
              Start a workspace
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3">
          {workflowSteps.map((step, index) => (
            <article
              className="grid grid-cols-[3.5rem_1fr] gap-5 rounded-[18px] border border-slate-100 bg-[#fbfbfa] p-5"
              key={step.title}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-[#e4f2ff] text-[#1688e8]">
                <step.icon className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#1688e8]">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-black tracking-[-0.02em] text-[#1e1e22]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 text-base leading-7 text-[#77777c]">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingWorkspaceShowcase() {
  return (
    <section className="bg-[#fbfbfa] px-5 py-20" id="replay">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mx-auto max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.045em] text-[#1e1e22] md:text-6xl">
          Replay the document like a story, not a log file.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#77777c]">
          A clean workspace view for writing, editing, reviewing, and sharing
          the history that matters.
        </p>
        <Button
          asChild
          className="mt-8 h-[3.25rem] rounded-full bg-[#101116] px-7 text-base font-extrabold text-white hover:bg-[#24252c]"
        >
          <Link href="/blog/narrative-replays">
            Read the replay guide
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>

        <div className="relative mx-auto mt-10 max-w-5xl rounded-[34px] bg-[#dcecff] p-4 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
          <WorkspaceMockup compact />
          <div className="pointer-events-none absolute -right-8 -top-8 hidden size-28 rounded-full bg-[#ffd65a] md:block" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 hidden size-[4.5rem] rounded-full bg-[#ff6767] md:block" />
        </div>
      </div>
    </section>
  );
}

export function LandingProofCta() {
  return (
    <section className="bg-white px-5 py-20">
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
        {[
          ["3x", "faster context handoff"],
          ["0", "separate recap docs"],
          ["1", "shareable replay link"],
        ].map(([value, label]) => (
          <article
            className="rounded-[20px] bg-[#f4f4f3] p-7 text-center"
            key={label}
          >
            <p className="text-6xl font-black tracking-[-0.05em] text-[#1e1e22]">
              {value}
            </p>
            <p className="mt-3 text-base font-bold text-[#77777c]">{label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LandingFaq() {
  return (
    <section className="bg-[#fbfbfa] px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-5xl font-black tracking-[-0.045em] text-[#1e1e22] md:text-6xl">
          FAQs
        </h2>
        <div className="mt-9 divide-y divide-slate-200">
          {faqItems.map((item, index) => (
            <details
              className="group py-7"
              key={item.question}
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-xl font-black tracking-[-0.02em] text-[#1e1e22]">
                {item.question}
                <span className="flex size-7 shrink-0 items-center justify-center">
                  <Plus className="size-6 transition group-open:rotate-45" />
                </span>
              </summary>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[#77777c]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFinalCta() {
  return (
    <section className="bg-white px-5 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#101116] text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
          <MessageSquareText className="size-10" />
        </div>
        <h2 className="mt-8 text-5xl font-black leading-[1.02] tracking-[-0.045em] text-[#1e1e22] md:text-6xl">
          Start with one document that your team keeps coming back to.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#77777c]">
          Bring the room into the draft, keep the decisions visible, and share
          the replay when the path matters.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="h-[3.25rem] rounded-full bg-[#101116] px-7 text-base font-extrabold text-white hover:bg-[#24252c]"
          >
            <Link href="/sign-in">
              Get Started Free
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Link
            className="inline-flex h-[3.25rem] items-center gap-2 rounded-full px-5 text-base font-extrabold text-[#1688e8]"
            href="/blog"
          >
            <CircleCheck className="size-5" />
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
