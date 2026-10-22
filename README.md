# LightWebsiteUi

**A website starter in one command:** Astro 7 · React 19 · Tailwind CSS 4 · shadcn/ui · Lucide · Motion · TypeScript.

[Русская версия](README.ru.md) · [Website](https://si0683.github.io/LightWebsiteUi/)

```bash
npm create lightwebsiteui@latest my-site
cd my-site
npm run dev
```

The command copies the template, installs every dependency and creates a git repository. Until the package is on npm, run it straight from GitHub:

```bash
npx github:si0683/LightWebsiteUi my-site
```

Options: `--no-install` (skip `npm install`), `--no-git` (skip `git init`). pnpm, yarn and bun work too (`pnpm create lightwebsiteui`).

## What you get

| | |
|---|---|
| [Astro](https://astro.build) | pages are plain HTML, JavaScript only where needed (islands) |
| [React](https://react.dev) | interactive components |
| [Tailwind CSS 4](https://tailwindcss.com) | styling, via `@tailwindcss/vite` |
| [shadcn/ui](https://ui.shadcn.com) | 19 components ready, add more with `npx shadcn@latest add` |
| [Lucide](https://lucide.dev) | 1,600+ icons, `lucide-react` |
| [Motion](https://motion.dev) | animations for React (`motion/react`), ready `Reveal` for scroll-in blocks |
| TypeScript, ESLint, Prettier | strict types, lint, Tailwind class sorting |

Plus: a ready landing page (header, mobile menu, hero, features, pricing, reviews, FAQ, order dialog, footer) with all texts in one file `src/data/site.ts`, light/dark theme without flicker, a violet-pink-amber theme, `AGENTS.md` for AI assistants and a GitHub Pages workflow.

## Template structure

```
src/
  pages/index.astro       landing page
  layouts/main.astro      <head>, theme script
  data/site.ts            all page texts
  components/site/        site blocks (menu, order dialog, FAQ, reviews, theme toggle, Reveal)
  components/ui/          shadcn/ui components
  styles/global.css       Tailwind + theme tokens
.github/workflows/deploy.yml
AGENTS.md / CLAUDE.md     rules for AI assistants
```

## Build it with AI

[PROMT.md](https://raw.githubusercontent.com/si0683/LightWebsiteUi/main/PROMT.md) is a fill-in brief for AI assistants (Claude Code, Cursor, Codex…): describe your site, web app, service or SaaS — type, pages, features, design — then tell the assistant in the project folder: *"Read PROMT.md and AGENTS.md and build the project from the «Промт» section. Start with a plan and questions."* The file is also copied into every new project. (The brief is in Russian.)

## Developing this repository

```bash
cd template && npm install && npm run dev   # work on the template
npm pack                                    # test the installer: npx ./create-lightwebsiteui-<v>.tgz test
```

Versions up to 3.2.1 were a CDN library (`lightwebsiteui.js`). Their tags stay on jsDelivr, so existing pages keep working.

MIT © si0683
