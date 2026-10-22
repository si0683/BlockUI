import type { CollectionConfig } from 'payload'

import { Orders } from '../collections/Orders'

// Online payment (--pay): the "Заказы" collection with /api/orders/pay, /webhook and /status.
export const paymentCollections: CollectionConfig[] = [Orders]
