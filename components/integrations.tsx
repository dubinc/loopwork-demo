import {
  Cloudflare,
  Figma,
  GitHubEnhanced,
  GoogleEnhanced,
  Slack,
  Vercel,
} from "@dub/ui/icons";
import { INTEGRATIONS } from "@/lib/content";

const ICONS = {
  Slack,
  Figma,
  GoogleEnhanced,
  GitHubEnhanced,
  Vercel,
  Cloudflare,
} as const;

export function Integrations() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand-600">
            Integrations
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Works with the tools you already use
          </h2>
          <p className="mt-4 text-balance text-base text-neutral-600 sm:text-lg">
            Loopwork connects to your existing stack, so switching doesn&apos;t
            mean starting over.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 sm:grid-cols-6">
          {INTEGRATIONS.map((name) => {
            const Icon = ICONS[name as keyof typeof ICONS];
            return (
              <div
                key={name}
                className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-card"
              >
                <Icon className="size-7 text-neutral-700" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
