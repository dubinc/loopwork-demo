import { Avatar } from "@dub/ui";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand-600">
            Loved by delivery teams
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Don&apos;t just take our word for it
          </h2>
          <p className="mt-4 text-balance text-base text-neutral-600 sm:text-lg">
            Thousands of agencies and product teams run their delivery
            through Loopwork every day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="text-[15px] leading-relaxed text-neutral-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar identifier={testimonial.name} className="size-9" />
                <div>
                  <div className="text-sm font-semibold text-neutral-950">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {testimonial.title}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
