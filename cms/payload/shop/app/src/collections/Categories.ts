import type { CollectionConfig } from 'payload'

import { publicRead, publicReadCustom } from '../access'
import { slugify } from '../lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  access: publicRead,
  custom: publicReadCustom,
  defaultSort: 'order',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'parent', 'order'], group: 'Магазин' },
  hooks: {
    beforeValidate: [({ data }) => (data && !data.slug && data.name ? { ...data, slug: slugify(data.name) } : data)],
  },
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    { name: 'slug', label: 'Адрес (латиницей)', type: 'text', unique: true, index: true },
    { name: 'parent', label: 'Родительская категория', type: 'relationship', relationTo: 'categories' },
    { name: 'order', label: 'Порядок', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'externalId',
      label: 'Ид в 1С',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Заполняется обменом с 1С (--1c)' },
    },
  ],
}
