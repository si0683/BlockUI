import type { Payload } from 'payload'

// Fills an empty database with the demo content of the site template, so the site looks the same
// right after the CMS is connected. Runs on every start but does nothing once there is content.
export async function seed(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'features' })
  if (totalDocs > 0) return
  payload.logger.info('Seeding demo content…')

  await payload.updateGlobal({
    slug: 'site',
    data: {
      name: 'Студия Лайт',
      tagline: 'Делаем сайты, которые продают',
      description:
        'Лендинги, интернет-магазины и сайты-визитки под ключ. Быстрые, красивые и удобные на телефоне.',
      phone: '+7 900 000-00-00',
      email: 'hello@example.com',
      nav: [
        { label: 'Услуги', href: '#services' },
        { label: 'Тарифы', href: '#pricing' },
        { label: 'Отзывы', href: '#reviews' },
        { label: 'Вопросы', href: '#faq' },
      ],
    },
  })

  const features = [
    ['zap', 'Быстро', 'Astro отдаёт готовый HTML — страница открывается мгновенно.'],
    ['smartphone', 'Под телефон', 'Вёрстка подстраивается под любой экран от 320 px.'],
    ['palette', 'Красиво', 'Готовые компоненты shadcn/ui и своя цветовая тема.'],
    ['search', 'SEO', 'Чистая разметка и мета-теги — поисковики видят всё.'],
    ['moon', 'Тёмная тема', 'Переключается одной кнопкой и запоминается.'],
    ['shield-check', 'Надёжно', 'TypeScript, ESLint и Prettier уже настроены.'],
  ] as const
  for (const [order, [icon, title, text]] of features.entries()) {
    await payload.create({ collection: 'features', data: { icon, title, text, order } })
  }

  const plans = [
    { name: 'Визитка', price: '15 000 ₽', amount: 15000, text: 'Одна страница о вас', items: ['До 5 блоков', 'Форма заявки', 'Запуск за 3 дня'] },
    { name: 'Лендинг', price: '35 000 ₽', amount: 35000, text: 'Продающая страница', items: ['До 12 блоков', 'Анимации', 'Подключение аналитики', 'Запуск за неделю'], popular: true },
    { name: 'Магазин', price: 'от 90 000 ₽', text: 'Каталог и корзина', items: ['Каталог товаров', 'Корзина и заказ', 'Админка', 'Поддержка месяц'] },
  ]
  for (const [order, plan] of plans.entries()) {
    await payload.create({
      collection: 'plans',
      data: { ...plan, items: plan.items.map((text) => ({ text })), order },
    })
  }

  const reviews = [
    ['Анна', 'Кондитерская', 'Заявок стало вдвое больше уже в первый месяц.'],
    ['Игорь', 'Автосервис', 'Сайт летает даже на старом телефоне. Клиенты довольны.'],
    ['Мария', 'Школа танцев', 'Сделали быстро и красиво, всё понятно в управлении.'],
  ]
  for (const [order, [name, role, text]] of reviews.entries()) {
    await payload.create({ collection: 'reviews', data: { name, role, text, order } })
  }

  const faq = [
    ['Сколько стоит поддержка?', 'Первый месяц бесплатно, дальше — по договорённости.'],
    ['Можно ли менять тексты самому?', 'Да, в админке: откройте /admin, все блоки сайта там.'],
    ['Где разместить сайт?', 'Сайт — на любом хостинге, CMS — на сервере с Node.js.'],
  ]
  for (const [order, [q, a]] of faq.entries()) {
    await payload.create({ collection: 'faq', data: { q, a, order } })
  }
}
