import Link from "next/link";
import { business, telHref } from "@/lib/business";
import { Phone, ArrowRight } from "@/components/icons";

/**
 * Fixed bottom bar, mobile only. Most emergency traffic is someone standing in
 * a wet room holding a phone — the call target should never be more than a
 * thumb away, and never require scrolling to find.
 */
export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div aria-hidden="true" className="hazard-rule h-1.5" />
      <div className="grid grid-cols-5 bg-carbon-950">
        <a
          href={telHref}
          className="col-span-3 flex items-center justify-center gap-2.5 bg-hivis-400 px-4 py-4 font-display text-lg uppercase tracking-tight text-carbon-950 active:bg-hivis-500"
        >
          <Phone className="h-5 w-5" />
          {business.phone.display}
        </a>
        <Link
          href="/contact"
          className="col-span-2 flex items-center justify-center gap-2 border-l-2 border-carbon-800 px-3 py-4 font-display text-sm uppercase tracking-tight text-paper-100 active:bg-carbon-900"
        >
          Quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
