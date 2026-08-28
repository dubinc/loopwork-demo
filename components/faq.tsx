import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@dub/ui";
import { FAQS } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" className="bg-neutral-50 py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-1">
            <span className="text-sm font-semibold text-brand-600">FAQ</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-balance text-base text-neutral-600">
              Can&apos;t find what you&apos;re looking for? Reach out to our
              team and we&apos;ll get back to you within a few hours.
            </p>
          </div>

          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="border-b border-neutral-200 py-1 first:pt-0"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-base font-semibold text-neutral-950 sm:text-[17px]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-8 text-[15px] leading-relaxed text-neutral-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
