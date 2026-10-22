# LightWebsiteUi

**Стартер сайта одной командой:** Astro 7 · React 19 · Tailwind CSS 4 · shadcn/ui · Lucide · Motion · TypeScript.

[English](README.md) · [Сайт](https://si0683.github.io/LightWebsiteUi/)

```bash
npm create lightwebsiteui@latest my-site
cd my-site
npm run dev
```

Команда копирует шаблон, сама ставит все зависимости и создаёт git-репозиторий. Пока пакета нет в npm, запускайте прямо с GitHub:

```bash
npx github:si0683/LightWebsiteUi my-site
```

Ключи: `--no-install` (без `npm install`), `--no-git` (без `git init`). Работает и с pnpm, yarn, bun (`pnpm create lightwebsiteui`).

## Что внутри

| | |
|---|---|
| [Astro](https://astro.build) | страницы — обычный HTML, JavaScript только где нужен (острова) |
| [React](https://react.dev) | интерактивные компоненты |
| [Tailwind CSS 4](https://tailwindcss.com) | стили, через `@tailwindcss/vite` |
| [shadcn/ui](https://ui.shadcn.com) | 19 компонентов уже в проекте, остальные — `npx shadcn@latest add` |
| [Lucide](https://lucide.dev) | 1600+ иконок, `lucide-react` |
| [Motion](https://motion.dev) | анимации React (`motion/react`), готовый `Reveal` — появление блоков при прокрутке |
| TypeScript, ESLint, Prettier | строгие типы, линтер, сортировка классов Tailwind |

А ещё: готовый лендинг (шапка, мобильное меню, первый экран, преимущества, тарифы, отзывы, FAQ, окно заявки, подвал), все тексты в одном файле `src/data/site.ts`, светлая/тёмная тема без мигания, фиолетово-розово-янтарная палитра, `AGENTS.md` для нейросетей и выкладка на GitHub Pages.

## Структура шаблона

```
src/
  pages/index.astro       главная
  layouts/main.astro      <head>, скрипт темы
  data/site.ts            все тексты страницы
  components/site/        блоки сайта (меню, заявка, FAQ, отзывы, тема, Reveal)
  components/ui/          компоненты shadcn/ui
  styles/global.css       Tailwind + цвета темы
.github/workflows/deploy.yml
AGENTS.md / CLAUDE.md     правила для нейросетей
```

## Проект через ИИ

[PROMT.md](https://raw.githubusercontent.com/si0683/LightWebsiteUi/main/PROMT.md) — техническое задание для ИИ-ассистента (Claude Code, Cursor, Codex…). Скачайте его или возьмите из папки нового проекта, заполните (тип, страницы, функции, дизайн) и напишите ассистенту в папке проекта:

> Прочитай PROMT.md и AGENTS.md и сделай проект по разделу «Промт». Начни с плана и вопросов.

## Разработка репозитория

```bash
cd template && npm install && npm run dev   # правка шаблона
npm pack                                    # проверка установщика: npx ./create-lightwebsiteui-<v>.tgz test
```

Версии до 3.2.1 были CDN-библиотекой (`lightwebsiteui.js`). Их теги остаются на jsDelivr — старые страницы продолжают работать.

MIT © si0683
