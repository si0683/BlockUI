# Changelog

## 4.1.0 — 2026-10-22

- Motion 14 (`motion/react`) added to the template: `Reveal` component fades blocks in on scroll (with a cascade and hover lift), used on the demo page; respects reduced motion.
- Docs: Motion section in the template README, rules in `template/AGENTS.md`.

## 4.0.0 — 2026-10-22

LightWebsiteUi is now a project starter instead of a CDN library.

- `npm create lightwebsiteui` (package `create-lightwebsiteui`): copies the template, installs dependencies, runs `git init`.
- Template: Astro 7, React 19, Tailwind CSS 4, shadcn/ui (radix-nova, 19 components), lucide-react, TypeScript, ESLint, Prettier.
- Ready landing page with texts in `src/data/site.ts`, light/dark theme, GitHub Pages workflow, `AGENTS.md` for AI assistants.
- Removed: `lightwebsiteui.js/.css/.mjs/.d.ts`, examples (Samara businesses, Next.js, Astro), photo tools, AI.md, PROMPT*.md. Tags v1.0.0–v3.2.1 still serve the old library on jsDelivr.
