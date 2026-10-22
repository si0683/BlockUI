import type { CollectionConfig, Endpoint } from 'payload'

import { Orders } from './collections/Orders'

// Extra parts added by installer options: online payment (--pay) — the "Заказы" collection
// with /api/orders/pay, /api/orders/webhook and /api/orders/status.
export const extraCollections: CollectionConfig[] = [Orders]
export const extraEndpoints: Endpoint[] = []
