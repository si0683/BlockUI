# AGENTS.md — rules for AI coding agents

Website on **Astro 7 + React 19 + Tailwind CSS 4 + shadcn/ui (radix, style "radix-nova") + lucide-react + Motion + TypeScript**.
Created with `npm create lightwebsiteui`.

## Structure

- `src/pages/*.astro` — pages (file = URL). `src/layouts/main.astro` — `<html>`, `<head>`, theme script.
- `src/data/site.ts` — page texts. Put content here, not inline in markup.
- `src/components/site/*.tsx` — site blocks built from shadcn parts (menu, order dialog, FAQ, review card, theme toggle) and `Reveal` (scroll-in animation).
- `src/components/ui/*.tsx` — shadcn/ui components. Add new ones with `npx shadcn@latest add <name>` (never write them by hand); edit them only when the design requires it.
- `src/styles/global.css` — Tailwind import, theme tokens (`:root` light, `.dark` dark), utilities `text-brand` / `bg-brand`.
- Import alias `@/` = `src/`. `cn()` from `@/lib/utils` merges classes.

## Rules

- Style with Tailwind classes and theme tokens (`bg-background`, `text-muted-foreground`, `bg-primary`, `border`…), not raw colours, so light and dark themes both work. Dark mode = `.dark` class on `<html>`; use `dark:` variants.
- Icons: `lucide-react` only, imported by name (`import { HeartIcon } from "lucide-react"`), sized with `size-*`. Inside `Button` use `data-icon="inline-start" | "inline-end"`.
- Animations: **Motion** (`import { motion, AnimatePresence } from "motion/react"`, docs https://motion.dev/docs/react) for React components; the package is `motion`, not `framer-motion`. Scroll-in blocks in `.astro`: wrap them in `<Reveal client:visible delay={i * 0.08}>` (children stay static HTML, nested islands keep working). Respect reduced motion (`useReducedMotion`). Simple CSS enter animations: `tw-animate-css` classes (`animate-in fade-in slide-in-from-bottom-4`).
- React in `.astro`:
  - no `client:*` → static HTML, no JS. Interactive components need `client:load` (above the fold) or `client:visible`.
  - every React component placed in `.astro` renders as a separate island, so React context does **not** cross them: compose Dialog, Sheet, Tabs, Accordion, Select, DropdownMenu, Avatar, Carousel, Tooltip (with its `TooltipProvider`) inside one `.tsx` component in `src/components/site/`.
  - `asChild` does not work from `.astro`; style links with `buttonVariants({ variant, size })` from `@/components/ui/button`.
  - in `.astro` use `class`, in `.tsx` use `className`.
- Links and assets must respect the base path (GitHub Pages serves from `/<repo>/`): use `import.meta.env.BASE_URL`.
- Mobile first: check 320–1280 px widths, no horizontal scroll.
- Keep page text in the site language (Russian by default, `lang="ru"` in the layout); code comments in English.

## Check before finishing

```bash
npm run build && npm run typecheck && npm run lint && npm run format
```
