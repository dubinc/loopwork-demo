import { Button, Grid } from "@dub/ui";
import { ArrowUpRight, CirclePlay, Sparkle3 } from "@dub/ui/icons";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 sm:pt-20">
      <Grid
        cellSize={64}
        className="text-neutral-200/70 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_10%,transparent_70%)]"
      />
      <div className="bg-grid-fade pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]" />

      <div className="relative mx-auto flex max-w-screen-xl flex-col items-center px-4 text-center lg:px-8">
        <Link
          href="#features"
          className="group flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
        >
          <Sparkle3 className="size-3.5" />
          New: Team workload &amp; capacity planning
          <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl sm:leading-[1.1] md:text-6xl">
          Loopwork keeps work moving
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-neutral-600 sm:text-lg">
          Projects, tasks, time, and client updates — in one calm workspace.
          Loopwork gives your team clarity on what&apos;s next, so nothing
          stalls and nothing slips.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            text="Start for free"
            icon={<ArrowUpRight className="size-4" />}
            className="h-11 w-full border-brand-600 bg-brand-600 px-6 text-[15px] text-white hover:bg-brand-700 hover:ring-brand-100 sm:w-fit"
          />
          <Button
            text="Watch demo"
            variant="secondary"
            icon={<CirclePlay className="size-4" />}
            className="h-11 w-full px-6 text-[15px] sm:w-fit"
          />
        </div>

        <p className="mt-4 text-xs font-medium text-neutral-400">
          No credit card required · Free for up to 3 projects · Cancel
          anytime
        </p>

        <div className="relative mt-14 w-full max-w-5xl sm:mt-16">
          <div
            className="absolute -inset-x-10 -inset-y-10 -z-10 opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 30%, rgba(140,89,248,0.25), transparent 70%)",
            }}
          />
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-card-hover">
            <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-100/80 px-4 py-3">
              <span className="size-2.5 rounded-full bg-neutral-300" />
              <span className="size-2.5 rounded-full bg-neutral-300" />
              <span className="size-2.5 rounded-full bg-neutral-300" />
              <span className="ml-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-neutral-400">
                app.loopwork.so
              </span>
            </div>
            <Image
              src="/images/dashboard-screenshot.png"
              alt="Loopwork dashboard showing active projects, tasks, and team workload"
              width={996}
              height={631}
              priority
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
