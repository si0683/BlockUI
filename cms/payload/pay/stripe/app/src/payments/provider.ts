import { createHmac, randomUUID, timingSafeEqual } from 'crypto'

import type { PaymentProvider, PaymentStatus } from './types'

// Stripe Checkout — https://docs.stripe.com/api/checkout/sessions
// Keys: Dashboard → Developers → API keys. Test mode keys (sk_test_…) and test cards
// (4242 4242 4242 4242) charge nothing.
const API = (process.env.STRIPE_API_URL || 'https://api.stripe.com/v1').replace(/\/$/, '')
const secretKey = process.env.STRIPE_SECRET_KEY || ''
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
const currency = (process.env.STRIPE_CURRENCY || 'rub').toLowerCase()

async function request<T>(path: string, form?: Record<string, string>): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: form ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Idempotency-Key': randomUUID() } : {}),
    },
    body: form ? new URLSearchParams(form) : undefined,
  })
  if (!response.ok) throw new Error(`Stripe ${response.status}: ${await response.text()}`)
  return response.json() as Promise<T>
}

/** Checks the Stripe-Signature header: HMAC-SHA256 of "timestamp.body", 5 minutes tolerance */
function verifySignature(rawBody: string, header: string) {
  const parts = Object.fromEntries(header.split(',').map((part) => part.split('=') as [string, string]))
  const timestamp = Number(parts.t)
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) throw new Error('Stale signature')
  const expected = createHmac('sha256', webhookSecret).update(`${timestamp}.${rawBody}`).digest()
  const valid = header
    .split(',')
    .filter((part) => part.startsWith('v1='))
    .some((part) => {
      const signature = Buffer.from(part.slice(3), 'hex')
      return signature.length === expected.length && timingSafeEqual(signature, expected)
    })
  if (!valid) throw new Error('Bad signature')
}

export const provider: PaymentProvider = {
  name: 'stripe',
  currency: currency.toUpperCase(),

  configured: () => Boolean(secretKey),

  async createPayment({ orderId, amount, description, email, returnUrl }) {
    const session = await request<{ id: string; url: string }>('/checkout/sessions', {
      mode: 'payment',
      success_url: returnUrl,
      cancel_url: returnUrl,
      customer_email: email,
      client_reference_id: String(orderId),
      'metadata[orderId]': String(orderId),
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': currency,
      'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
      'line_items[0][price_data][product_data][name]': description,
    })
    return { id: session.id, url: session.url }
  },

  async getPayment(id) {
    const session = await request<{ id: string; status: string; payment_status: string }>(
      `/checkout/sessions/${encodeURIComponent(id)}`,
    )
    let status: PaymentStatus = 'pending'
    if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') status = 'paid'
    else if (session.status === 'expired') status = 'canceled'
    return { id: session.id, status }
  },

  async parseWebhook(rawBody, headers) {
    // With STRIPE_WEBHOOK_SECRET the signature is required; the status is re-read from the API anyway
    if (webhookSecret) verifySignature(rawBody, headers.get('stripe-signature') || '')
    const event = JSON.parse(rawBody) as { type?: string; data?: { object?: { id?: string } } }
    return event.type?.startsWith('checkout.session.') && event.data?.object?.id ? event.data.object.id : null
  },
}
