import { STATS } from "@/lib/content";

export function Stats() {
  return (
    <section className="bg-neutral-950 py-16 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-neutral-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
