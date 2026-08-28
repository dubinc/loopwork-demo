# Loopwork — Marketing Landing Page

A marketing landing page for **Loopwork**, a fictional B2B project & workflow
management SaaS. Built with Next.js (App Router), Tailwind CSS, and UI
components from [`@dub/ui`](https://www.npmjs.com/package/@dub/ui) (the design
system used by [dub.co](https://dub.co)).

## Stack

- **Next.js 15** (App Router, React 19)
- **Tailwind CSS 3** with the shared [`@dub/tailwind-config`](https://www.npmjs.com/package/@dub/tailwind-config) preset
- **[`@dub/ui`](https://www.npmjs.com/package/@dub/ui)** for `Button`, `Badge`, `Accordion`, `Avatar`, `MaxWidthWrapper`, `Grid`, and the icon set
- **lucide-react** for the star-rating icon (the bundled `@dub/ui` `Star` icon is stroke-only and doesn't support a filled variant)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the page.

## Project structure

```
app/                Next.js App Router entry (layout, globals.css, page)
components/         One component per landing page section (nav, hero, pricing, faq, footer, ...)
lib/content.ts       All page copy/data in one place (features, pricing, testimonials, FAQ, etc.)
lib/utils.ts          `cn()` class-merging helper (clsx + tailwind-merge)
public/images/         Brand assets (logo, wordmark, dashboard screenshot)
```

## Notes

- `@dub/ui` ships as a single pre-bundled entry point, so installing it pulls in
  its full dependency tree (Radix, Tiptap, visx, react-table, etc.) even though
  this page only uses a handful of components. `date-fns` and
  `@tiptap/suggestion` are pinned as explicit root dependencies because they're
  declared as _peer_ dependencies deeper in that tree and aren't auto-installed
  under `legacy-peer-deps` (see `.npmrc`).
- `tailwind.config.ts` is excluded from `tsconfig.json`'s program because
  `@dub/tailwind-config` ships its config as raw `.ts` source (not a compiled
  `.d.ts`), which otherwise drags a third-party type error into `next build`'s
  type-checking step. Tailwind/PostCSS still load the file fine at build time.
