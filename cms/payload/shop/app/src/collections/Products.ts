import type { CollectionConfig } from 'payload'

import { publicRead, publicReadCustom } from '../access'
import { slugify } from '../lib/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Товар', plural: 'Товары' },
  access: publicRead,
  custom: publicReadCustom,
  defaultSort: 'name',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'category', 'price', 'stock', 'active'],
    group: 'Магазин',
    listSearchableFields: ['name', 'sku'],
  },
  hooks: {
    beforeValidate: [({ data }) => (data && !data.slug && data.name ? { ...data, slug: slugify(data.name) } : data)],
  },
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    { name: 'slug', label: 'Адрес (латиницей)', type: 'text', unique: true, index: true },
    { name: 'sku', label: 'Артикул', type: 'text', index: true },
    { name: 'category', label: 'Категория', type: 'relationship', relationTo: 'categories' },
    {
      type: 'row',
      fields: [
        { name: 'price', label: 'Цена, ₽', type: 'number', required: true, min: 0 },
        { name: 'oldPrice', label: 'Старая цена, ₽', type: 'number', min: 0 },
        { name: 'stock', label: 'Остаток, шт', type: 'number', defaultValue: 0, min: 0 },
      ],
    },
    { name: 'images', label: 'Фото', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'description', label: 'Описание', type: 'textarea' },
    {
      name: 'attributes',
      label: 'Характеристики',
      type: 'array',
      fields: [
        { name: 'name', label: 'Свойство', type: 'text', required: true },
        { name: 'value', label: 'Значение', type: 'text', required: true },
      ],
    },
    { name: 'active', label: 'Показывать на сайте', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      name: 'externalId',
      label: 'Ид в 1С',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Заполняется обменом с 1С (--1c)' },
    },
    // Picture paths from 1C already uploaded to "Фото": the exchange skips unchanged pictures
    { name: 'syncedImages', type: 'text', admin: { hidden: true } },
  ],
}
