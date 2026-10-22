import type { CollectionSlug, PayloadRequest } from 'payload'

import { provider } from './provider'

// Collections whose documents can be paid online: plan orders (--pay) and shop orders (--shop)
const PAYABLE = ['orders', 'shop-orders']

/**
 * Finds the order of a payment, asks the provider for the real status and saves it.
 * Webhooks and "thanks" pages only call this — the provider API is the source of truth.
 */
export async function syncPayment(req: PayloadRequest, paymentId: string) {
  for (const slug of PAYABLE) {
    if (!req.payload.collections[slug as CollectionSlug]) continue
    const collection = slug as CollectionSlug
    const { docs } = await req.payload.find({
      collection,
      where: { paymentId: { equals: paymentId } },
      limit: 1,
      overrideAccess: true,
    })
    const order = docs[0] as { id: string | number; status?: string } | undefined
    if (!order) continue
    const payment = await provider.getPayment(paymentId)
    const waiting = order.status === 'pending' || order.status === 'new'
    let status: string | undefined
    if (payment.status === 'paid' && waiting) status = 'paid'
    else if (payment.status === 'canceled' && waiting) status = 'canceled'
    if (!status) return order
    return req.payload.update({
      collection,
      id: order.id,
      data: { status, ...(status === 'paid' ? { paidAt: new Date().toISOString() } : {}) } as never,
      overrideAccess: true,
    }) as Promise<{ id: string | number; status?: string }>
  }
  return null
}
