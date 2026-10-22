import type { CollectionConfig } from 'payload'

import { publicRead } from '../access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  access: publicRead,
  defaultSort: 'order',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'order'], group: 'Сайт' },
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true },
    { name: 'role', label: 'Кто это', type: 'text' },
    { name: 'text', label: 'Отзыв', type: 'textarea', required: true },
    { name: 'order', label: 'Порядок', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
