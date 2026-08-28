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
      {/* Type is clamped to the viewport and nowrap, so "(947) 777-4276" can
          never break across two lines — it did exactly that at 320px, which
          made the primary call target look broken. */}
      <div className="grid grid-cols-5 bg-carbon-950">
        <a
          href={telHref}
          className="col-span-3 flex items-center justify-center gap-2 whitespace-nowrap bg-hivis-400 px-2 py-4 font-display text-[clamp(0.9rem,4.4vw,1.125rem)] uppercase tracking-tight text-carbon-950 active:bg-hivis-500"
        >
          <Phone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          {business.phone.display}
        </a>
        <Link
          href="/contact"
          className="col-span-2 flex items-center justify-center gap-1.5 whitespace-nowrap border-l-2 border-carbon-800 px-2 py-4 font-display text-[clamp(0.8rem,3.6vw,0.875rem)] uppercase tracking-tight text-paper-100 active:bg-carbon-900"
        >
          Quote
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
