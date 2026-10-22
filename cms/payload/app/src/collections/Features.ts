import type { CollectionConfig } from 'payload'

import { publicRead, publicReadCustom } from '../access'

export const Features: CollectionConfig = {
  slug: 'features',
  labels: { singular: 'Преимущество', plural: 'Преимущества' },
  access: publicRead,
  custom: publicReadCustom,
  defaultSort: 'order',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'icon', 'order'], group: 'Сайт' },
  fields: [
    { name: 'title', label: 'Заголовок', type: 'text', required: true },
    { name: 'text', label: 'Текст', type: 'textarea', required: true },
    {
      name: 'icon',
      label: 'Иконка',
      type: 'select',
      required: true,
      defaultValue: 'zap',
      // Names from site/src/components/site/feature-icon.tsx
      options: ['zap', 'smartphone', 'palette', 'search', 'moon', 'shield-check'],
    },
    { name: 'order', label: 'Порядок', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
