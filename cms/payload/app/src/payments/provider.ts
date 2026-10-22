import type { PaymentProvider } from './types'

// No online payment in this project. --pay=yookassa|stripe replaces this file with a real provider;
// orders (plans, shop) then go to the payment page instead of waiting for a call from a manager.
export const provider: PaymentProvider = {
  name: 'none',
  currency: 'RUB',
  configured: () => false,
  async createPayment() {
    throw new Error('Online payment is not set up (create the project with --pay)')
  },
  async getPayment(id) {
    return { id, status: 'pending' }
  },
  async parseWebhook() {
    return null
  },
}
