import { randomUUID } from 'crypto'
import type { CollectionConfig, PayloadRequest } from 'payload'

import { provider } from '../payments/provider'
import { syncPayment } from '../payments/sync'
import type { PaymentStatus } from '../payments/types'

// Allowed site addresses (SITE_URL): CORS and where buyers may return after paying
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

// Orders of paid plans. Only the endpoints below create and update them;
// signed-in users see them in the admin panel.
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Заказ', plural: 'Заказы' },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'planName',
    defaultColumns: ['planName', 'amount', 'status', 'name', 'email', 'createdAt'],
  },
  fields: [
    { name: 'planName', label: 'Тариф', type: 'text', required: true },
    { name: 'plan', label: 'Тариф (ссылка)', type: 'relationship', relationTo: 'plans' },
    { name: 'amount', label: 'Сумма', type: 'number', required: true },
    { name: 'currency', label: 'Валюта', type: 'text', required: true },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидает оплаты', value: 'pending' },
        { label: 'Оплачен', value: 'paid' },
        { label: 'Отменён', value: 'canceled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', label: 'Имя', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'phone', label: 'Телефон', type: 'text' },
    { name: 'provider', label: 'Платёжная система', type: 'text', admin: { position: 'sidebar' } },
    { name: 'paymentId', label: 'ID платежа', type: 'text', index: true, admin: { position: 'sidebar' } },
    { name: 'paidAt', label: 'Оплачен', type: 'date', admin: { position: 'sidebar' } },
    // Secret token in the "thanks" link: the buyer checks the status without seeing other orders
    { name: 'token', type: 'text', index: true, admin: { hidden: true } },
  ],
  endpoints: [
    {
      // POST /api/orders/pay — creates an order and a payment, returns the payment page
      path: '/pay',
      method: 'post',
      handler: async (req) => {
        if (!provider.configured()) {
          return json({ error: 'Оплата не настроена: укажите ключи в cms/.env' }, 503)
        }
        const body = await readBody(req)
        if (body.website) return json({ error: 'Spam' }, 400) // honeypot
        const name = String(body.name ?? '').trim().slice(0, 100)
        const email = String(body.email ?? '').trim().slice(0, 200)
        const phone = String(body.phone ?? '').trim().slice(0, 40)
        const returnUrl = String(body.returnUrl ?? '')
        if (!name || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Укажите имя и e-mail' }, 400)
        // Buyers may only return to our own site (no open redirect)
        let back: URL
        try {
          back = new URL(returnUrl)
        } catch {
          return json({ error: 'Bad returnUrl' }, 400)
        }
        if (!sites.includes(back.origin)) return json({ error: 'Bad returnUrl' }, 400)

        // The price is taken from the CMS only — never from the browser
        const plan = await req.payload
          .findByID({ collection: 'plans', id: String(body.planId), overrideAccess: true })
          .catch(() => null)
        if (!plan?.amount) return json({ error: 'Этот тариф нельзя оплатить онлайн' }, 400)

        const token = randomUUID()
        const order = await req.payload.create({
          collection: 'orders',
          data: {
            planName: plan.name,
            plan: plan.id,
            amount: plan.amount,
            currency: provider.currency,
            name,
            email,
            phone,
            status: 'pending',
            provider: provider.name,
            token,
          },
          overrideAccess: true,
        })
        back.searchParams.set('order', token)
        try {
          const payment = await provider.createPayment({
            orderId: order.id,
            amount: plan.amount,
            description: `${plan.name} — заказ №${order.id}`,
            email,
            returnUrl: back.toString(),
          })
          await req.payload.update({
            collection: 'orders',
            id: order.id,
            data: { paymentId: payment.id },
            overrideAccess: true,
          })
          return json({ url: payment.url })
        } catch (error) {
          req.payload.logger.error({ err: error }, 'Payment was not created')
          await req.payload.update({
            collection: 'orders',
            id: order.id,
            data: { status: 'canceled' },
            overrideAccess: true,
          })
          return json({ error: 'Платёжная система не ответила, попробуйте позже' }, 502)
        }
      },
    },
    {
      // POST /api/orders/webhook — notifications from the payment provider
      path: '/webhook',
      method: 'post',
      handler: async (req) => {
        const raw = (await req.text?.()) || ''
        try {
          const paymentId = await provider.parseWebhook(raw, req.headers)
          if (paymentId) await syncPayment(req, paymentId)
          return json({ ok: true })
        } catch (error) {
          req.payload.logger.error({ err: error }, 'Payment webhook rejected')
          return json({ error: 'Bad webhook' }, 400)
        }
      },
    },
    {
      // GET /api/orders/status?order=<token> — for the site's "thanks" page
      path: '/status',
      method: 'get',
      handler: async (req) => {
        const token = String(req.searchParams.get('order') ?? '')
        if (!token) return json({ error: 'No order' }, 400)
        const { docs } = await req.payload.find({
          collection: 'orders',
          where: { token: { equals: token } },
          limit: 1,
          overrideAccess: true,
        })
        const order = docs[0]
        if (!order) return json({ error: 'Not found' }, 404)
        let status = order.status
        // No webhook yet (e.g. local development)? Ask the provider directly.
        if (status === 'pending' && order.paymentId && provider.configured()) {
          const synced = await syncPayment(req, order.paymentId).catch(() => null)
          status = (synced?.status as typeof status) ?? status
        }
        return json({
          status: status as PaymentStatus,
          plan: order.planName,
          amount: order.amount,
          currency: order.currency,
        })
      },
    },
  ],
}
