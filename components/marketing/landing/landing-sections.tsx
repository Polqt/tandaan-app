import {
  ArrowRight,
  Check,
  CircleHelp,
  FileText,
  Play,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { publicBillingTiers } from "@/lib/marketing/billing-plans";
import {
  accentClassNames,
  blogPosts,
  landingFaqs,
  landingFeatures,
  workflowSteps,
} from "@/lib/marketing/site-content";

export function LandingFeatureStrip() {
  return (
    <section className="public-torn-section">
      <div className="public-shell grid gap-10 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:py-20">
        <div>
          <p className="font-hand text-2xl text-(--color-paper-muted)">
            Everything in one place. Always in context.
          </p>
          <h2 className="mt-7 max-w-sm text-4xl font-bold leading-tight text-(--color-paper-ink) sm:text-5xl">
            Designed for how teams actually work
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-(--color-paper-muted)">
            Tandaan blends notes, decisions, files, and conversations into a
            workspace your team can trust.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {landingFeatures.map((feature) => (
            <article className="paper-panel min-h-68 p-5" key={feature.title}>
              <div
                className={`mb-8 flex size-10 items-center justify-center border ${accentClassNames[feature.accent]}`}
              >
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-xl font-bold text-(--color-paper-ink)">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection() {
  return (
    <section className="public-shell py-16 lg:py-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-2xl text-4xl font-bold text-(--color-paper-ink) sm:text-5xl">
          A workflow that feels natural
        </h2>
        <Link
          href="/features"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-(--color-paper-ink) underline decoration-paper-red decoration-2 underline-offset-8"
        >
          See features
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-4">
        {workflowSteps.map((step, index) => (
          <article
            className="paper-panel relative min-h-[18rem] p-5"
            key={step.title}
          >
            <span
              className="flex size-8 items-center justify-center rounded-full border-2 border-(--color-paper-ink) font-hand text-xl font-bold text-white"
              style={{ backgroundColor: step.color }}
            >
              {index + 1}
            </span>
            <step.icon className="mt-8 size-8 text-(--color-paper-ink)" />
            <h3 className="mt-5 max-w-[11rem] text-2xl font-bold leading-tight text-(--color-paper-ink)">
              {step.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
              {step.body}
            </p>
            {index < workflowSteps.length - 1 ? (
              <ArrowRight className="absolute -right-5 top-1/2 hidden size-7 text-(--color-paper-ink) lg:block" />
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ReplaySection() {
  return (
    <section className="public-band py-16 lg:py-24">
      <div className="public-shell grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="max-w-xl text-4xl font-bold text-(--color-paper-ink) sm:text-5xl">
            Decisions should leave a trail
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-(--color-paper-muted)">
            Replay chapters preserve the sequence behind a decision, not just
            the finished paragraph. Reviewers see momentum, false starts, and
            the final turn.
          </p>
          <Button asChild className="paper-button mt-8 h-12 px-6">
            <Link href="/blog/narrative-replays">
              Read the replay note
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="paper-ledger p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_0.8fr]">
            <div className="paper-panel p-5">
              <div className="flex items-center justify-between border-b border-(--color-paper-line) pb-3">
                <p className="font-hand text-3xl text-(--color-paper-ink)">
                  Decision
                </p>
                <span className="border border-paper-red px-2 py-1 text-xs font-bold text-[#b53024]">
                  May 12
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-(--color-paper-muted)">
                We are launching with 3 plans after the team reviewed support
                load, storage limits, and upgrade timing.
              </p>
              <Link
                href="/features"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-paper-blue"
              >
                See full context
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="paper-panel bg-[#fff1b8] p-5">
              <Play className="size-8 text-(--color-paper-ink)" />
              <p className="mt-7 font-hand text-3xl leading-8 text-(--color-paper-ink)">
                Replayable decisions
              </p>
              <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
                The useful context stays close to the artifact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BillingTeaser() {
  return (
    <section className="public-shell py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr]">
        <div>
          <h2 className="text-4xl font-bold text-(--color-paper-ink) sm:text-5xl">
            Simple pricing. Built for teams.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-8 text-(--color-paper-muted)">
            Start free, upgrade when your workspace needs unlimited documents
            and deeper replay history.
          </p>
          <Link
            href="/billing"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-(--color-paper-ink) underline decoration-paper-blue decoration-2 underline-offset-8"
          >
            View billing
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="paper-ledger grid gap-4 p-5 lg:grid-cols-2">
          {publicBillingTiers.map((tier) => (
            <article
              className={`paper-panel p-5 ${tier.featured ? "bg-[#fff1b8]" : ""}`}
              key={tier.name}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-hand text-3xl text-(--color-paper-ink)">
                    {tier.name}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-(--color-paper-ink)">
                    {tier.price}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--color-paper-soft)">
                    {tier.priceNote}
                  </p>
                </div>
                {tier.featured ? (
                  <Star className="size-6 text-paper-blue" />
                ) : null}
              </div>
              <p className="mt-5 text-sm leading-7 text-(--color-paper-muted)">
                {tier.description}
              </p>
              <ul className="mt-5 space-y-2">
                {tier.points.map((point) => (
                  <li
                    className="flex items-start gap-2 text-sm text-(--color-paper-ink)"
                    key={point}
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-paper-green" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogTeaser() {
  return (
    <section className="public-band py-16 lg:py-24">
      <div className="public-shell">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-bold text-(--color-paper-ink) sm:text-5xl">
              Stories, lessons, and ideas
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-(--color-paper-muted)">
              Notes on replay-driven collaboration, trustworthy context, and the
              craft of writing together.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-(--color-paper-ink) underline decoration-paper-red decoration-2 underline-offset-8"
          >
            From the blog
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Link
              href={`/blog/${post.slug}`}
              className="paper-panel block min-h-68 p-5"
              key={post.slug}
            >
              <div className="flex h-28 items-center justify-center border border-(--color-paper-line) bg-[#f7e8cf]">
                <FileText className="size-10 text-(--color-paper-ink)" />
                <span
                  className="ml-[-0.65rem] mt-8 block size-8 rotate-6 border border-(--color-paper-ink)"
                  style={{
                    backgroundColor:
                      index === 0
                        ? "#fff1b8"
                        : index === 1
                          ? "#dfe9fb"
                          : "#dcebbe",
                  }}
                />
              </div>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-(--color-paper-soft)">
                {post.date} - {post.readTime}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-(--color-paper-ink)">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-(--color-paper-muted)">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="public-shell py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr]">
        <div className="flex items-start gap-4">
          <CircleHelp className="mt-2 size-9 text-(--color-paper-ink)" />
          <h2 className="text-4xl font-bold text-(--color-paper-ink)">
            Common questions
          </h2>
        </div>
        <div className="paper-ledger divide-y divide-(--color-paper-line) p-2">
          {landingFaqs.map((faq) => (
            <details className="group px-4 py-5" key={faq.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-(--color-paper-ink)">
                {faq.question}
                <span className="font-hand text-3xl leading-none transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-base leading-8 text-(--color-paper-muted)">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
