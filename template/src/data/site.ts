// All texts of the demo page live here: edit them, the components stay untouched.
export const site = {
  name: "Студия Лайт",
  tagline: "Делаем сайты, которые продают",
  description:
    "Лендинги, интернет-магазины и сайты-визитки под ключ. Быстрые, красивые и удобные на телефоне.",
  phone: "+7 900 000-00-00",
  email: "hello@example.com",
  nav: [
    { label: "Услуги", href: "#services" },
    { label: "Тарифы", href: "#pricing" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Вопросы", href: "#faq" },
  ],
}

// Icon names come from src/components/site/feature-icon.tsx
export const features = [
  {
    icon: "zap",
    title: "Быстро",
    text: "Astro отдаёт готовый HTML — страница открывается мгновенно.",
  },
  {
    icon: "smartphone",
    title: "Под телефон",
    text: "Вёрстка подстраивается под любой экран от 320 px.",
  },
  {
    icon: "palette",
    title: "Красиво",
    text: "Готовые компоненты shadcn/ui и своя цветовая тема.",
  },
  {
    icon: "search",
    title: "SEO",
    text: "Чистая разметка и мета-теги — поисковики видят всё.",
  },
  {
    icon: "moon",
    title: "Тёмная тема",
    text: "Переключается одной кнопкой и запоминается.",
  },
  {
    icon: "shield-check",
    title: "Надёжно",
    text: "TypeScript, ESLint и Prettier уже настроены.",
  },
]

export const plans = [
  {
    name: "Визитка",
    price: "15 000 ₽",
    text: "Одна страница о вас",
    items: ["До 5 блоков", "Форма заявки", "Запуск за 3 дня"],
  },
  {
    name: "Лендинг",
    price: "35 000 ₽",
    text: "Продающая страница",
    items: [
      "До 12 блоков",
      "Анимации",
      "Подключение аналитики",
      "Запуск за неделю",
    ],
    popular: true,
  },
  {
    name: "Магазин",
    price: "от 90 000 ₽",
    text: "Каталог и корзина",
    items: ["Каталог товаров", "Корзина и заказ", "Админка", "Поддержка месяц"],
  },
]

export const reviews = [
  {
    name: "Анна",
    role: "Кондитерская",
    text: "Заявок стало вдвое больше уже в первый месяц.",
  },
  {
    name: "Игорь",
    role: "Автосервис",
    text: "Сайт летает даже на старом телефоне. Клиенты довольны.",
  },
  {
    name: "Мария",
    role: "Школа танцев",
    text: "Сделали быстро и красиво, всё понятно в управлении.",
  },
]

export const faq = [
  {
    q: "Сколько стоит поддержка?",
    a: "Первый месяц бесплатно, дальше — по договорённости.",
  },
  {
    q: "Можно ли менять тексты самому?",
    a: "Да, все тексты лежат в одном файле src/data/site.ts.",
  },
  {
    q: "Где разместить сайт?",
    a: "На любом хостинге: после npm run build это обычные HTML-файлы в папке dist.",
  },
]
