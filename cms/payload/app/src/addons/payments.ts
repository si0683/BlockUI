import type { CollectionConfig } from 'payload'

// Online payment (--pay=yookassa|stripe) replaces this file with the "Заказы" collection
// and its endpoints /api/orders/pay, /webhook, /status.
export const paymentCollections: CollectionConfig[] = []
