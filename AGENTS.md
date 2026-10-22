# AGENTS.md — rules for AI coding agents

LightWebsiteUi (since 4.0.0) is a **project starter**, not a runtime library: the npm package `create-lightwebsiteui` copies `template/` (Astro + React + Tailwind CSS + shadcn/ui + Lucide + Motion) into a new folder and runs `npm install`.

- `bin/create.mjs` — the CLI. Node ≥ 22.12, **no dependencies** (only `node:` modules). npm never publishes `.gitignore`, so the template keeps it as `template/_gitignore` and the CLI renames it.
- `template/` — a working Astro project. Work on it in place: `cd template && npm install && npm run dev` (node_modules, dist, .astro and package-lock.json are git-ignored and excluded from the package).
- shadcn/ui components in `template/src/components/ui/` come from the CLI only: `npx shadcn@latest add <name>` inside `template/`, then `npm run format`. Never hand-write them. Update the component list in both READMEs and `template/README.md`.
- `template/AGENTS.md` is the guide for agents working in the user's new project — keep it in sync with the template (React islands in Astro: no shared context, no `asChild`, `client:*`).
- Template texts are Russian (`lang="ru"`), code comments English.
- Before a release, check the whole path: `npm pack`, then `npx ./create-lightwebsiteui-<v>.tgz "Test Site"` in a temp folder, and in the new project `npm run build`, `npm run typecheck`, `npm run lint`, `npx prettier --check .`; open `npm run dev`, test the order dialog, mobile menu, FAQ, theme toggle at 375 px and 1280 px.
- Versions: `version` in package.json + CHANGELOG.md + tag `vX.Y.Z`. Published tags are never changed.
- `index.html` in the root is the GitHub Pages landing (static, no build): Russian, light/dark theme, violet-pink-amber palette.
- Old tags v1.0.0–v3.2.1 hold the former CDN library (`blockui.js` / `lightwebsiteui.js`). Lesson repos (CreateSite01PROMT and the lesson sites) pin them through jsDelivr — do not delete those tags.
