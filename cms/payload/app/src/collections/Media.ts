import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Файлы' },
  access: {
    read: () => true,
  },
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
