import type { CollectionConfig } from 'payload'

import { publicReadCustom } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Файлы' },
  access: {
    read: () => true,
  },
  custom: publicReadCustom,
  fields: [
    {
      name: 'alt',
      label: 'Описание (alt)',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
