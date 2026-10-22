import { randomUUID } from 'crypto'
import type { CollectionConfig, PayloadRequest } from 'payload'

import { provider } from '../payments/provider'
import { syncPayment } from '../payments/sync'

// Allowed site addresses (SITE_URL): where buyers may return after paying
const sites = (process.env.SITE_URL || 'http://localhost:4321')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

const json = (data: unknown, status = 200) => Response.json(data, { status })

async function readBody(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return JSON.parse((await req.text?.()) || '{}')
  } catch {
    return {}
  }
}

const text = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)

// Shop orders: created only by /checkout (prices and stock are taken from the CMS),
// signed-in users manage them in the admin panel; --1c sends them to 1C.
export const ShopOrders: CollectionConfig = {
  slug: 'shop-orders',
  labels: { singular: 'Заказ магазина', plural: 'Заказы магазина' },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['id', 'name', 'phone', 'total', 'status', 'createdAt'],
    group: 'Магазин',
  },
  fields: [
    {
      name: 'items',
      label: 'Товары',
      type: 'array',
      required: true,
      fields: [
        { name: 'product', label: 'Товар', type: 'relationship', relationTo: 'products' },
        { name: 'name', label: 'Название', type: 'text', required: true },
        { name: 'sku', label: 'Артикул', type: 'text' },
        { name: 'externalId', label: 'Ид в 1С', type: 'text' },
        { name: 'price', label: 'Цена', type: 'number', required: true },
        { name: 'qty', label: 'Количество', type: 'number', required: true },
      ],
    },
    { name: 'total', label: 'Сумма, ₽', type: 'number', required: true },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Новый', value: 'new' },
        { label: 'Оплачен', value: 'paid' },
        { label: 'В работе', value: 'processing' },
        { label: 'Отгружен', value: 'shipped' },
        { label: 'Выполнен', value: 'done' },
        { label: 'Отменён', value: 'canceled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', label: 'Покупатель', type: 'text', required: true },
    { name: 'phone', label: 'Телефон', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'address', label: 'Адрес доставки', type: 'textarea' },
    { name: 'comment', label: 'Комментарий', type: 'textarea' },
    { name: 'provider', label: 'Платёжная система', type: 'text', admin: { position: 'sidebar' } },
    { name: 'paymentId', label: 'ID платежа', type: 'text', index: true, admin: { position: 'sidebar' } },
    { name: 'paidAt', label: 'Оплачен', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'exportedAt',
      label: 'Выгружен в 1С',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, description: 'Заполняется обменом с 1С (--1c)' },
    },
    // Secret token in the order link: the buyer sees the status without seeing other orders
    { name: 'token', type: 'text', index: true, admin: { hidden: true } },
  ],
  endpoints: [
    {
      // POST /api/shop-orders/checkout — cart → order (→ payment page when --pay is set up)
      path: '/checkout',
      method: 'post',
      handler: async (req) => {
        const body = await readBody(req)
        if (body.website) return json({ error: 'Spam' }, 400) // honeypot
        const name = text(body.name, 100)
        const phone = text(body.phone, 40)
        const email = text(body.email, 200)
        if (!name || !phone) return json({ error: 'Укажите имя и телефон' }, 400)
        if (email && !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Проверьте e-mail' }, 400)
        const paying = provider.configured()
        if (paying && !email) return json({ error: 'Укажите e-mail — на него придёт чек' }, 400)

        let back: URL
        try {
          back = new URL(String(body.returnUrl ?? ''))
        } catch {
          return json({ error: 'Bad returnUrl' }, 400)
        }
        if (!sites.includes(back.origin)) return json({ error: 'Bad returnUrl' }, 400)

        // Prices, names and stock come from the CMS only — never from the browser
        const wanted = Array.isArray(body.items) ? body.items.slice(0, 100) : []
        const items: { product: number; name: string; sku?: string; externalId?: string; price: number; qty: number }[] = []
        for (const entry of wanted as { id?: unknown; qty?: unknown }[]) {
          const qty = Math.floor(Number(entry?.qty))
          if (!(qty >= 1 && qty <= 999)) return json({ error: 'Неверное количество' }, 400)
          const product = await req.payload
            .findByID({ collection: 'products', id: String(entry?.id), depth: 0, overrideAccess: true })
            .catch(() => null)
          if (!product || !product.active) return json({ error: 'Товар больше не продаётся' }, 400)
          if ((product.stock ?? 0) < qty) {
            return json({ error: `«${product.name}»: в наличии ${product.stock ?? 0} шт.` }, 409)
          }
          items.push({
            product: product.id,
            name: product.name,
            sku: product.sku ?? undefined,
            externalId: product.externalId ?? undefined,
            price: product.price,
            qty,
          })
        }
        if (!items.length) return json({ error: 'Корзина пуста' }, 400)
        const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

        const token = randomUUID()
        const order = await req.payload.create({
          collection: 'shop-orders',
          data: {
            items,
            total,
            status: 'new',
            name,
            phone,
            email: email || undefined,
            address: text(body.address, 500),
            comment: text(body.comment, 1000),
            provider: paying ? provider.name : undefined,
            token,
          },
          overrideAccess: true,
        })
        // Reserve the goods: stock goes down right away (1C overwrites it on the next exchange)
        for (const item of items) {
          const product = await req.payload.findByID({ collection: 'products', id: item.product, depth: 0, overrideAccess: true })
          await req.payload.update({
            collection: 'products',
            id: item.product,
            data: { stock: Math.max(0, (product.stock ?? 0) - item.qty) },
            overrideAccess: true,
          })
        }

        back.searchParams.set('order', token)
        if (!paying) return json({ url: back.toString() })
        try {
          const payment = await provider.createPayment({
            orderId: order.id,
            amount: total,
            description: `Заказ №${order.id}`,
            email,
            returnUrl: back.toString(),
          })
          await req.payload.update({
            collection: 'shop-orders',
            id: order.id,
            data: { paymentId: payment.id },
            overrideAccess: true,
          })
          return json({ url: payment.url })
        } catch (error) {
          req.payload.logger.error({ err: error }, 'Payment was not created')
          // The order stays: a manager calls the buyer; the order page shows "waiting for payment"
          return json({ url: back.toString() })
        }
      },
    },
    {
      // GET /api/shop-orders/status?order=<token> — for the site's order page
      path: '/status',
      method: 'get',
      handler: async (req) => {
        const token = String(req.searchParams.get('order') ?? '')
        if (!token) return json({ error: 'No order' }, 400)
        const { docs } = await req.payload.find({
          collection: 'shop-orders',
          where: { token: { equals: token } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const order = docs[0]
        if (!order) return json({ error: 'Not found' }, 404)
        let status = order.status
        if (status === 'new' && order.paymentId && provider.configured()) {
          const synced = await syncPayment(req, order.paymentId).catch(() => null)
          status = (synced?.status as typeof status) ?? status
        }
        return json({
          id: order.id,
          status,
          total: order.total,
          payment: Boolean(order.paymentId),
          items: order.items.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
        })
      },
    },
  ],
}
