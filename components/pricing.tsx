import { Button } from "@dub/ui";
import { Check2 } from "@dub/ui/icons";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/content";

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand-600">
            Pricing
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Simple pricing that scales with your team
          </h2>
          <p className="mt-4 text-balance text-base text-neutral-600 sm:text-lg">
            Start free. Upgrade when you need more visibility across
            projects, clients, and teams.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7",
                plan.popular
                  ? "border-brand-600 bg-neutral-950 shadow-card-hover"
                  : "border-neutral-200 bg-white shadow-soft",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}

              <h3
                className={cn(
                  "font-display text-lg font-semibold",
                  plan.popular ? "text-white" : "text-neutral-950",
                )}
              >
                {plan.name}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm",
                  plan.popular ? "text-neutral-400" : "text-neutral-600",
                )}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "font-display text-4xl font-bold tracking-tight",
                    plan.popular ? "text-white" : "text-neutral-950",
                  )}
                >
                  {plan.price}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    plan.popular ? "text-neutral-400" : "text-neutral-500",
                  )}
                >
                  {plan.period}
                </span>
              </div>

              <Button
                text={plan.cta}
                className={cn(
                  "mt-6 h-10",
                  plan.popular
                    ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700 hover:ring-brand-900"
                    : "",
                )}
                variant={plan.popular ? "primary" : "secondary"}
              />

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                        plan.popular
                          ? "bg-white/10 text-brand-300"
                          : "bg-brand-50 text-brand-700",
                      )}
                    >
                      <Check2 className="size-3" />
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        plan.popular ? "text-neutral-300" : "text-neutral-700",
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
