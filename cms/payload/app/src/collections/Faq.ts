import type { CollectionConfig } from 'payload'

import { publicRead, publicReadCustom } from '../access'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Вопрос', plural: 'Вопросы и ответы' },
  access: publicRead,
  custom: publicReadCustom,
  defaultSort: 'order',
  admin: { useAsTitle: 'q', defaultColumns: ['q', 'order'], group: 'Сайт' },
  fields: [
    { name: 'q', label: 'Вопрос', type: 'text', required: true },
    { name: 'a', label: 'Ответ', type: 'textarea', required: true },
    { name: 'order', label: 'Порядок', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
