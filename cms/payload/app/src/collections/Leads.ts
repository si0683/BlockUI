import { APIError, type CollectionConfig } from 'payload'

// Leads from the site's order form. Anyone may create one; only signed-in users see them.
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'plan', 'status', 'createdAt'] },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        // Honeypot field: hidden from people, filled in by spam bots
        if (!req.user && data?.website) throw new APIError('Spam', 400)
        if (!req.user && data) data.status = 'new'
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true, maxLength: 100 },
    { name: 'phone', label: 'Телефон', type: 'text', required: true, maxLength: 40 },
    { name: 'message', label: 'Комментарий', type: 'textarea', maxLength: 2000 },
    { name: 'plan', label: 'Тариф', type: 'text', maxLength: 100 },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'work' },
        { label: 'Готово', value: 'done' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'website', type: 'text', admin: { hidden: true } },
  ],
}
