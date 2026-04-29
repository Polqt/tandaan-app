import { AtSign, Globe2 } from "lucide-react";
import Link from "next/link";
import { footerColumns } from "@/lib/marketing/site-content";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-shell grid gap-12 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Link
            href="/"
            className="font-hand text-[3rem] font-semibold leading-none text-(--color-paper-ink)"
          >
            Tandaan
          </Link>
          <p className="mt-5 max-w-md text-lg leading-8 text-(--color-paper-muted)">
            Remember together. Built for teams who write, decide, and need the
            story behind the work to stay attached.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="mailto:hello@tandaan.app"
              className="public-icon-button"
              aria-label="Email Tandaan"
            >
              <AtSign className="size-4" />
            </Link>
            <Link href="/docs" className="public-icon-button" aria-label="Docs">
              <Globe2 className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--color-paper-soft)">
                {column.title}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    className="text-sm font-semibold text-(--color-paper-ink) underline-offset-4 transition hover:text-(--color-paper-red) hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="public-shell flex flex-col gap-3 border-t border-(--color-paper-line) py-5 text-xs text-(--color-paper-soft) sm:flex-row sm:items-center sm:justify-between">
        <p>(c) 2026 Tandaan Labs Inc.</p>
        <p className="font-hand text-base text-(--color-paper-muted)">
          Made for teams who remember together.
        </p>
      </div>
    </footer>
  );
}
