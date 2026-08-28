import {
  CalendarDays,
  ChartActivity2,
  ChartArea2,
  MessageSmile,
  Sitemap,
  Timer2,
} from "@dub/ui/icons";
import { FEATURES } from "@/lib/content";

const ICONS = {
  Sitemap,
  CalendarDays,
  Timer2,
  MessageSmile,
  ChartActivity2,
  ChartArea2,
} as const;

export function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand-600">
            Features
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Everything your team needs to ship, in one loop
          </h2>
          <p className="mt-4 text-balance text-base text-neutral-600 sm:text-lg">
            Stop stitching together spreadsheets, docs, and chat threads.
            Loopwork brings the whole delivery workflow into a single, shared
            source of truth.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon as keyof typeof ICONS];
            return (
              <div
                key={feature.title}
                className="group relative flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-neutral-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
