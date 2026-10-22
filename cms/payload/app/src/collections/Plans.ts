import type { CollectionConfig } from 'payload'

import { publicRead } from '../access'

export const Plans: CollectionConfig = {
  slug: 'plans',
  labels: { singular: 'Тариф', plural: 'Тарифы' },
  access: publicRead,
  defaultSort: 'order',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'price', 'popular', 'order'], group: 'Сайт' },
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    { name: 'price', label: 'Цена', type: 'text', required: true },
    { name: 'text', label: 'Подзаголовок', type: 'text' },
    {
      name: 'items',
      label: 'Что входит',
      type: 'array',
      fields: [{ name: 'text', label: 'Пункт', type: 'text', required: true }],
    },
    { name: 'popular', label: 'Популярный', type: 'checkbox', defaultValue: false },
    { name: 'order', label: 'Порядок', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
