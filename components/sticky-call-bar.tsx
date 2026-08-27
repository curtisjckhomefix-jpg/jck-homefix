import Link from "next/link";
import { business, telHref } from "@/lib/business";
import { Phone } from "@/components/icons";

/**
 * Fixed bottom call bar, mobile only. Most emergency water-damage traffic is
 * a person on a phone standing in a wet room — the call target should never
 * be more than a thumb away, and should never require scrolling to find.
 */
export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-800 bg-ink-950/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-2 p-2.5">
        <a
          href={telHref}
          className="col-span-3 flex items-center justify-center gap-2 rounded-lg bg-alert-600 px-3 py-3.5 text-base font-bold text-white active:bg-alert-700"
        >
          <Phone className="h-5 w-5" />
          <span>Call Now</span>
        </a>
        <Link
          href="/contact"
          className="col-span-2 flex items-center justify-center rounded-lg border border-water-600 bg-ink-900 px-3 py-3.5 text-sm font-bold text-water-200 active:bg-ink-800"
        >
          Get a Quote
        </Link>
      </div>
      <p className="pb-2 text-center text-[11px] text-sand-300">
        {business.phone.display} · Answered 24/7
      </p>
    </div>
  );
}
