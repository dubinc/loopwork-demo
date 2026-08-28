import { ArrowRight } from "@dub/ui/icons";
import Link from "next/link";

export function AnnouncementBar() {
  return (
    <Link
      href="#customers"
      className="group flex h-9 w-full items-center justify-center gap-1.5 bg-brand-600 px-4 text-center text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
    >
      <span className="truncate">
        Loopwork raises $18M Series A to help teams ship on time
      </span>
      <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
