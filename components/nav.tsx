"use client";

import { Button } from "@dub/ui";
import { ArrowUpRight, Menu3, Xmark } from "@dub/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 w-full max-w-screen-xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/wordmark.png"
              alt="Loopwork"
              width={500}
              height={127}
              priority
              className="h-6 w-auto sm:h-7"
            />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            text="Log in"
            variant="secondary"
            className="h-9 w-fit border-none bg-transparent px-3 shadow-none hover:bg-neutral-100"
          />
          <Link href="#pricing">
            <Button
              text="Get a demo"
              variant="secondary"
              className="h-9 w-fit px-4"
            />
          </Link>
          <Button
            text="Start for free"
            icon={<ArrowUpRight className="size-4" />}
            className="h-9 w-fit border-brand-600 bg-brand-600 px-4 text-white hover:bg-brand-700 hover:ring-brand-100"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <Xmark className="size-5" /> : <Menu3 className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4">
            <Button text="Log in" variant="secondary" className="h-10" />
            <Button
              text="Start for free"
              className="h-10 border-brand-600 bg-brand-600 text-white hover:bg-brand-700 hover:ring-brand-100"
            />
          </div>
        </div>
      )}
    </header>
  );
}
