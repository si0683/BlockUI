import type { CollectionConfig, Payload } from 'payload'

import { Categories } from '../collections/Categories'
import { Products } from '../collections/Products'
import { ShopOrders } from '../collections/ShopOrders'

// The shop (--shop): categories, products and shop orders with /api/shop-orders/checkout and /status.
export const shopCollections: CollectionConfig[] = [Categories, Products, ShopOrders]

// Demo catalog for an empty shop, and a "Каталог" link in the site menu
export async function shopSeed(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'products' })
  if (totalDocs > 0) return
  payload.logger.info('Seeding demo shop…')

  const site = await payload.findGlobal({ slug: 'site', depth: 0 })
  const nav = site.nav ?? []
  if (!nav.some((link) => link.href.includes('catalog'))) {
    await payload.updateGlobal({ slug: 'site', data: { nav: [...nav, { label: 'Каталог', href: 'catalog/' }] } })
  }

  const categories: Record<string, number> = {}
  for (const [order, name] of ['Кофе', 'Чай', 'Посуда'].entries()) {
    categories[name] = (await payload.create({ collection: 'categories', data: { name, order } })).id
  }
  const products = [
    { name: 'Кофе в зёрнах «Эфиопия»', category: 'Кофе', price: 890, oldPrice: 990, stock: 25, sku: 'CF-001', attributes: [['Вес', '250 г'], ['Обжарка', 'средняя']] },
    { name: 'Кофе в зёрнах «Бразилия»', category: 'Кофе', price: 790, stock: 40, sku: 'CF-002', attributes: [['Вес', '250 г'], ['Обжарка', 'тёмная']] },
    { name: 'Молотый кофе для турки', category: 'Кофе', price: 450, stock: 0, sku: 'CF-003', attributes: [['Вес', '200 г']] },
    { name: 'Чай улун «Те Гуань Инь»', category: 'Чай', price: 650, stock: 12, sku: 'TE-001', attributes: [['Вес', '100 г']] },
    { name: 'Зелёный чай «Сенча»', category: 'Чай', price: 520, stock: 18, sku: 'TE-002', attributes: [['Вес', '100 г']] },
    { name: 'Френч-пресс 600 мл', category: 'Посуда', price: 1490, stock: 7, sku: 'DS-001', attributes: [['Объём', '600 мл'], ['Материал', 'стекло, сталь']] },
  ]
  for (const product of products) {
    await payload.create({
      collection: 'products',
      data: {
        ...product,
        category: categories[product.category],
        description: `${product.name}. Демо-товар: замените в админке или загрузите каталог из 1С.`,
        attributes: product.attributes.map(([name, value]) => ({ name, value })),
        active: true,
      },
    })
  }
}
