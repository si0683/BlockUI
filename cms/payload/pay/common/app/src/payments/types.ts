// One interface for every payment provider (YooKassa, Stripe…). Orders.ts talks only to it.

export type PaymentStatus = 'pending' | 'paid' | 'canceled'

export interface CreatePayment {
  orderId: string | number
  /** Amount in currency units (rubles), not kopecks */
  amount: number
  description: string
  email: string
  /** Where the buyer returns after paying (the site's /thanks page) */
  returnUrl: string
}

export interface PaymentProvider {
  name: string
  currency: string
  /** Keys are set in .env */
  configured(): boolean
  /** Creates a payment and returns its id and the page where the buyer pays */
  createPayment(data: CreatePayment): Promise<{ id: string; url: string }>
  /** Asks the provider for the real status — the source of truth for orders */
  getPayment(id: string): Promise<{ id: string; status: PaymentStatus }>
  /** Reads a webhook and returns the payment id to re-check, or null to ignore it */
  parseWebhook(rawBody: string, headers: Headers): Promise<string | null>
}
