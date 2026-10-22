import type { GlobalConfig } from 'payload'

// Company details and the menu: one record for the whole site
export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Настройки сайта',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  admin: { group: 'Сайт' },
  fields: [
    { name: 'name', label: 'Название компании', type: 'text', required: true },
    { name: 'tagline', label: 'Главный заголовок', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea', required: true },
    { name: 'phone', label: 'Телефон', type: 'text' },
    { name: 'email', label: 'E-mail', type: 'email' },
    {
      name: 'nav',
      label: 'Меню',
      type: 'array',
      fields: [
        { name: 'label', label: 'Текст', type: 'text', required: true },
        { name: 'href', label: 'Ссылка', type: 'text', required: true },
      ],
    },
  ],
}
