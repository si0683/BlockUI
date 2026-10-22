import type { CollectionConfig, Endpoint } from 'payload'

import { ExchangeLog } from '../collections/ExchangeLog'
import { exchange } from '../onec/exchange'

// Exchange with 1C (--1c): the CommerceML endpoint /api/1c/exchange that 1C calls
// ("Обмен с сайтом") and the exchange log. See 1C.md.
export const integrationCollections: CollectionConfig[] = [ExchangeLog]
export const integrationEndpoints: Endpoint[] = [
  { path: '/1c/exchange', method: 'get', handler: exchange },
  { path: '/1c/exchange', method: 'post', handler: exchange },
]
