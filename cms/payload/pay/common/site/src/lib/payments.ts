// Online payment through Payload CMS (cms/src/collections/Orders.ts).
// The CMS takes the price from the plan, creates the payment and returns the payment page.
const CMS_URL = (
  import.meta.env.PUBLIC_CMS_URL || "http://localhost:3000"
).replace(/\/$/, "")

export interface Buyer {
  name: string
  email: string
  phone?: string
}

export type OrderStatus = {
  status: "pending" | "paid" | "canceled"
  plan: string
  amount: number
  currency: string
}

/** Creates an order and sends the buyer to the payment page */
export async function startPayment(planId: string | number, buyer: Buyer) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "")
  const returnUrl = new URL(`${base}/thanks/`, window.location.origin).href
  const response = await fetch(`${CMS_URL}/api/orders/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, returnUrl, ...buyer }),
  })
  const data = (await response.json().catch(() => ({}))) as {
    url?: string
    error?: string
  }
  if (!response.ok || !data.url)
    throw new Error(data.error || "Оплата недоступна")
  window.location.href = data.url
}

/** Status of an order by the token from the "thanks" link */
export async function getOrderStatus(token: string): Promise<OrderStatus> {
  const response = await fetch(
    `${CMS_URL}/api/orders/status?order=${encodeURIComponent(token)}`
  )
  if (!response.ok) throw new Error(`Order not found: ${response.status}`)
  return response.json() as Promise<OrderStatus>
}

export const formatPrice = (amount: number, currency = "RUB") =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
