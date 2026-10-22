# Мой сайт

Создан командой `npm create lightwebsiteui` — стек [LightWebsiteUi](https://github.com/si0683/LightWebsiteUi):
**Astro 7 · React 19 · Tailwind CSS 4 · shadcn/ui · Lucide · Motion · TypeScript**.

## Команды

```bash
npm run dev        # сайт на http://localhost:4321, правки видны сразу
npm run build      # готовый сайт в папке dist/ — загрузите на любой хостинг
npm run preview    # посмотреть собранный dist/
npm run typecheck  # проверка типов (astro check)
npm run lint       # ESLint
npm run format     # Prettier, классы Tailwind сортируются сами
```

## Где что лежит

```
src/
  pages/index.astro       главная страница (каждый файл в pages/ — отдельный адрес)
  layouts/main.astro      общий <head>, тёмная тема без мигания
  data/site.ts            ВСЕ тексты демо-страницы: меняйте здесь
  components/site/        блоки сайта: меню, окно заявки, FAQ, отзывы, тема, Reveal
  components/ui/          компоненты shadcn/ui (свои файлы, можно править)
  styles/global.css       Tailwind + цвета темы (--primary и др.), text-brand / bg-brand
public/                   картинки и файлы «как есть» (favicon.svg)
.github/workflows/        выкладка на GitHub Pages
```

## Компоненты shadcn/ui

Уже добавлены: accordion, avatar, badge, button, card, carousel, checkbox, dialog,
dropdown-menu, input, label, navigation-menu, select, separator, sheet, switch,
tabs, textarea, tooltip. Любой другой — одной командой:

```bash
npx shadcn@latest add calendar
```

Каталог: https://ui.shadcn.com/docs/components

## Иконки Lucide

```tsx
import { HeartIcon } from "lucide-react"

;<HeartIcon className="size-5 text-primary" />
```

Все иконки: https://lucide.dev/icons

## Анимации Motion

[Motion](https://motion.dev) (бывший Framer Motion) — анимации React-компонентов.
Готовый `Reveal` плавно показывает блок при прокрутке:

```astro
<Reveal client:visible delay={0.1} lift>
  <Card>…</Card>
</Reveal>
```

Свои анимации:

```tsx
import { motion } from "motion/react"

;<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ scale: 1.05 }}
/>
```

Документация: https://motion.dev/docs/react

## Astro + React: три правила

1. React-компонент в `.astro` без `client:*` превращается в обычный HTML (без JavaScript).
   Для кнопок, окон и меню, которые реагируют на клики, добавьте `client:load`
   (или `client:visible` — загрузится, когда блок появится на экране).
2. Каждый React-компонент в `.astro` рендерится отдельно. Составные компоненты с общим
   состоянием (Dialog, Tabs, Accordion, Avatar, Select…) собирайте в `.tsx`-файле
   в `src/components/site/` и вставляйте в страницу целиком.
3. `asChild` в `.astro` не работает — ссылку-кнопку делайте так:
   `<a href="#" class={buttonVariants({ variant: "outline" })}>…</a>`.

## Цвета

Тема — CSS-переменные в `src/styles/global.css` (`:root` — светлая, `.dark` — тёмная).
Поменяйте `--primary`, и весь сайт перекрасится. Готовые темы: https://ui.shadcn.com/themes

## Выкладка на GitHub Pages

1. Залейте проект в репозиторий GitHub (ветка `main`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Каждый push публикует сайт на `https://<user>.github.io/<repo>/`.

Адреса в коде пишите через `import.meta.env.BASE_URL`, чтобы они работали и в подпапке `/<repo>/`.

## Через ИИ

Заполните `PROMT.md` — техническое задание: что делаем, функции, дизайн. Весь файл — готовый промт: его можно скопировать в любой ИИ-чат или написать ИИ-ассистенту в этой папке:

> Прочитай PROMT.md и сделай по нему проект.
