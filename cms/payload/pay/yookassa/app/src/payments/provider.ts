import { randomUUID } from 'crypto'

import type { PaymentProvider, PaymentStatus } from './types'

// YooKassa — https://yookassa.ru/developers/api
// Keys: personal account → Integration → API keys. A test shop gives test keys (test_…)
// and test cards, money is not charged.
const API = (process.env.YOOKASSA_API_URL || 'https://api.yookassa.ru/v3').replace(/\/$/, '')
const shopId = process.env.YOOKASSA_SHOP_ID || ''
const secretKey = process.env.YOOKASSA_SECRET_KEY || ''

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  if (!response.ok) throw new Error(`YooKassa ${response.status}: ${await response.text()}`)
  return response.json() as Promise<T>
}

const statuses: Record<string, PaymentStatus> = { succeeded: 'paid', canceled: 'canceled' }

export const provider: PaymentProvider = {
  name: 'yookassa',
  currency: 'RUB',

  configured: () => Boolean(shopId && secretKey),

  async createPayment({ orderId, amount, description, email, returnUrl }) {
    const value = { value: amount.toFixed(2), currency: 'RUB' }
    const payment = await request<{ id: string; confirmation: { confirmation_url: string } }>('/payments', {
      method: 'POST',
      headers: { 'Idempotence-Key': randomUUID() },
      body: JSON.stringify({
        amount: value,
        capture: true,
        confirmation: { type: 'redirect', return_url: returnUrl },
        description: description.slice(0, 128),
        metadata: { orderId: String(orderId) },
        // Receipts under 54-FZ via "Чеки от ЮKassa" (enable them in the account first)
        ...(process.env.YOOKASSA_RECEIPTS === 'true'
          ? {
              receipt: {
                customer: { email },
                items: [
                  {
                    description: description.slice(0, 128),
                    quantity: '1.00',
                    amount: value,
                    vat_code: Number(process.env.YOOKASSA_VAT_CODE || 1),
                    payment_subject: 'service',
                    payment_mode: 'full_payment',
                  },
                ],
              },
            }
          : {}),
      }),
    })
    return { id: payment.id, url: payment.confirmation.confirmation_url }
  },

  async getPayment(id) {
    const payment = await request<{ id: string; status: string }>(`/payments/${encodeURIComponent(id)}`)
    return { id: payment.id, status: statuses[payment.status] ?? 'pending' }
  },

  // YooKassa notifications are not signed: the payment id is taken from the body
  // and the real status is always re-read from the API (see syncPayment in Orders.ts).
  async parseWebhook(rawBody) {
    const event = JSON.parse(rawBody) as { event?: string; object?: { id?: string } }
    return event.event?.startsWith('payment.') && event.object?.id ? event.object.id : null
  },
}
