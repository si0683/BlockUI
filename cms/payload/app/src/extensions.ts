import type { CollectionConfig, Endpoint } from 'payload'

// Extra parts added by installer options. Online payment (--pay=yookassa|stripe)
// replaces this file and adds the "Заказы" collection with its endpoints.
export const extraCollections: CollectionConfig[] = []
export const extraEndpoints: Endpoint[] = []
