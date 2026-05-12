import { Heart } from "lucide-react";
import Link from "next/link";
import { footerColumns } from "@/lib/marketing/site-content";
import { BrandWordmark, SketchStar } from "./sketch-primitives";

export default function PublicFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--color-sketch-line)] bg-white/75">
      <div className="sketch-shell grid gap-10 py-9 md:grid-cols-[1fr_2fr_0.7fr]">
        <div>
          <Link href="/" aria-label="Tandaan.AI home">
            <BrandWordmark />
          </Link>
          <p className="mt-5 max-w-[12rem] text-sm leading-6 text-[var(--color-sketch-muted)]">
            Remember ideas.
            <br />
            Build together.
            <br />
            Move forward.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-black text-[var(--color-sketch-ink)]">
                {column.title}
              </p>
              <div className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <Link
                    className="text-sm text-[var(--color-sketch-muted)] transition hover:text-[var(--color-sketch-blue)]"
                    href={link.href}
                    key={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative hidden items-end justify-end lg:flex">
          <SketchStar className="absolute bottom-5 left-2 size-5" />
          <div className="sketch-sticky-note rotate-[-2deg] p-5 text-center">
            <p className="font-hand text-xl leading-6 text-[var(--color-sketch-ink)]">
              Made with
              <Heart className="mx-1 inline size-4" />
              in PH
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
