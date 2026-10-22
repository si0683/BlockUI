import type { CollectionConfig } from 'payload'

// Journal of the exchange with 1C: what was loaded and what failed. Written only by /api/1c/exchange.
export const ExchangeLog: CollectionConfig = {
  slug: 'exchange-log',
  labels: { singular: 'Обмен с 1С', plural: 'Обмен с 1С' },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['createdAt', 'type', 'mode', 'result', 'message'],
    group: 'Магазин',
  },
  fields: [
    {
      name: 'type',
      label: 'Обмен',
      type: 'select',
      options: [
        { label: 'Каталог', value: 'catalog' },
        { label: 'Заказы', value: 'sale' },
      ],
    },
    { name: 'mode', label: 'Шаг', type: 'text' },
    { name: 'filename', label: 'Файл', type: 'text' },
    {
      name: 'result',
      label: 'Результат',
      type: 'select',
      options: [
        { label: 'Успешно', value: 'success' },
        { label: 'Ошибка', value: 'failure' },
      ],
    },
    { name: 'message', label: 'Сообщение', type: 'textarea' },
  ],
}
