import { ArrowRight, Check, CreditCard, Star } from "lucide-react";
import Link from "next/link";
import PublicFooter from "@/components/marketing/shared/public-footer";
import { Button } from "@/components/ui/button";
import {
  billingQuestions,
  publicBillingTiers,
} from "@/lib/marketing/billing-plans";

export default function BillingPage() {
  return (
    <div className="public-page">
      <div className="paper-grain pointer-events-none fixed inset-0 z-0 opacity-70" />
      <div className="relative z-10">
        <section className="public-shell grid min-h-[64vh] items-end gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.02] text-(--color-paper-ink) sm:text-6xl">
              Simple billing for replayable work
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-(--color-paper-muted) sm:text-xl sm:leading-9">
              Start with the free workspace. Upgrade when your team needs
              unlimited documents, full replay history, and priority support.
            </p>
            <p className="mt-4 text-sm leading-7 text-(--color-paper-muted)">
              Signed-in users can start checkout from the workspace when they
              reach a free-plan limit.
            </p>
          </div>

          <div className="paper-note rotate-2 bg-[#dfe9fb] lg:mb-4">
            <CreditCard className="size-8 text-paper-blue" />
            <p className="mt-5 font-hand text-4xl leading-10 text-(--color-paper-ink)">
              No fake enterprise tier until the product earns one.
            </p>
          </div>
        </section>

        <section className="public-torn-section py-16 lg:py-24">
          <div className="public-shell grid gap-5 lg:grid-cols-2">
            {publicBillingTiers.map((tier) => (
              <article
                className={`paper-panel p-6 ${tier.featured ? "bg-[#fff1b8]" : ""}`}
                key={tier.name}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-hand text-4xl text-(--color-paper-ink)">
                      {tier.name}
                    </p>
                    <p className="mt-4 text-5xl font-bold text-(--color-paper-ink)">
                      {tier.price}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-(--color-paper-soft)">
                      {tier.priceNote}
                    </p>
                  </div>
                  {tier.featured ? (
                    <div className="paper-note bg-white px-3 py-2">
                      <Star className="size-5 text-paper-blue" />
                    </div>
                  ) : null}
                </div>

                <p className="mt-6 max-w-xl text-base leading-8 text-(--color-paper-muted)">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.points.map((point) => (
                    <li
                      className="flex items-start gap-3 text-base text-(--color-paper-ink)"
                      key={point}
                    >
                      <Check className="mt-1 size-4 shrink-0 text-paper-green" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {tier.featured ? (
                    <Button
                      asChild
                      className="paper-button paper-button-red h-12 w-full px-5"
                    >
                      <Link href="/documents">
                        Open workspace to upgrade
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="paper-link-button h-12 w-full"
                      variant="ghost"
                    >
                      <Link href="/sign-in">Start free</Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="public-shell py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
            <h2 className="text-4xl font-bold text-(--color-paper-ink)">
              Billing questions
            </h2>
            <div className="paper-ledger divide-y divide-(--color-paper-line) p-2">
              {billingQuestions.map((item) => (
                <details className="group px-4 py-5" key={item.question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-(--color-paper-ink)">
                    {item.question}
                    <span className="font-hand text-3xl leading-none transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-(--color-paper-muted)">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  );
}
