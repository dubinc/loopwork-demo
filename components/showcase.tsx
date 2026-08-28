import { Check2 } from "@dub/ui/icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SHOWCASES } from "@/lib/content";

export function Showcase() {
  return (
    <section id="product" className="bg-neutral-50 py-20 sm:py-28">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-24 px-4 lg:px-8">
        {SHOWCASES.map((item) => (
          <div
            key={item.title}
            className={cn(
              "flex flex-col items-center gap-10 lg:flex-row lg:gap-16",
              item.align === "left" && "lg:flex-row-reverse",
            )}
          >
            <div className="flex-1">
              <span className="text-sm font-semibold text-brand-600">
                {item.eyebrow}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 text-balance text-base leading-relaxed text-neutral-600">
                {item.description}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Check2 className="size-3" />
                    </span>
                    <span className="text-sm text-neutral-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative w-full flex-1">
              <div
                className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, rgba(140,89,248,0.18), transparent 70%)",
                }}
              />
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={996}
                  height={631}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
