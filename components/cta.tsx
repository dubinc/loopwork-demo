import { Button } from "@dub/ui";
import { ArrowUpRight } from "@dub/ui/icons";

export function Cta() {
  return (
    <section className="bg-white px-4 py-16 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-3xl bg-neutral-950 px-6 py-16 text-center sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(140,89,248,0.35), transparent 70%)",
          }}
        />
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to keep your work moving?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-neutral-400 sm:text-lg">
          Join thousands of teams who traded scattered spreadsheets for one
          calm, connected workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            text="Start for free"
            icon={<ArrowUpRight className="size-4" />}
            className="h-11 w-full border-brand-600 bg-brand-600 px-6 text-[15px] text-white hover:bg-brand-700 hover:ring-brand-900 sm:w-fit"
          />
          <Button
            text="Talk to sales"
            variant="secondary"
            className="h-11 w-full border-white/15 bg-transparent px-6 text-[15px] text-white hover:bg-white/10 sm:w-fit"
          />
        </div>
        <p className="mt-4 text-xs font-medium text-neutral-500">
          No credit card required · Free for up to 3 projects
        </p>
      </div>
    </section>
  );
}
