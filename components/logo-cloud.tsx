import { LOGO_CLOUD } from "@/lib/content";

export function LogoCloud() {
  return (
    <section id="customers" className="border-y border-neutral-100 bg-white py-12">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Trusted by fast-moving teams at
        </p>
        <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {LOGO_CLOUD.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center font-display text-lg font-bold text-neutral-300 transition-colors hover:text-neutral-500 sm:text-xl"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
