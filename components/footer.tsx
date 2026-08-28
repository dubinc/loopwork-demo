import { Github, LinkedIn, Twitter } from "@dub/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/content";

const socials = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/loopworkhq" },
  {
    name: "LinkedIn",
    icon: LinkedIn,
    href: "https://www.linkedin.com/company/loopwork",
  },
  { name: "GitHub", icon: Github, href: "https://github.com/loopwork" },
];

const columnClass = "text-sm font-semibold text-neutral-950";
const listClass = "mt-4 flex flex-col gap-3";
const linkClass =
  "text-sm text-neutral-500 transition-colors hover:text-neutral-900";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Image
              src="/images/wordmark.png"
              alt="Loopwork"
              width={500}
              height={127}
              className="h-6 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              The calm workspace for projects, tasks, and client updates.
              Built for agencies and teams who deliver work for a living.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900"
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={columnClass}>Product</h3>
            <ul className={listClass}>
              {FOOTER_LINKS.product.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnClass}>Company</h3>
            <ul className={listClass}>
              {FOOTER_LINKS.company.map((item) =>
                "external" in item && item.external ? (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={linkClass}
                    >
                      {item.name}
                    </a>
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link href={item.href} className={linkClass}>
                      {item.name}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className={columnClass}>Resources</h3>
            <ul className={listClass}>
              {FOOTER_LINKS.resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Loopwork, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {FOOTER_LINKS.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-neutral-400 hover:text-neutral-700"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
