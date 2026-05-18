import { Heart } from "lucide-react";
import Link from "next/link";
import { footerColumns } from "@/lib/marketing/site-content";
import { BrandWordmark } from "./sketch-primitives";

export default function PublicFooter() {
  return (
    <footer className="bg-[#2b2b2b] px-5 py-8 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_2fr]">
        <div>
          <Link href="/" aria-label="Tandaan.AI home">
            <BrandWordmark className="text-[2rem] text-white" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/62">
            Remember ideas. Build together. Move forward.
          </p>
          <p className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-white/72">
            Made with
            <Heart className="size-4" />
            in PH
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-black text-white">{column.title}</p>
              <div className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <Link
                    className="text-sm font-semibold text-white/58 transition hover:text-white"
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
      </div>
    </footer>
  );
}
