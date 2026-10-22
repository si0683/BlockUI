// The cart lives in the browser (localStorage). Prices here are only for display:
// the CMS recalculates the order from its own prices and stock at checkout.
export type CartItem = {
  id: number | string
  slug: string
  name: string
  price: number
  image?: string
  qty: number
}

const KEY = "cart"
const EVENT = "cart-change"

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as CartItem[]
  } catch {
    return []
  }
}

function save(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // private mode: the cart lives until the page is closed
  }
  window.dispatchEvent(new Event(EVENT))
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = getCart()
  const found = items.find((entry) => entry.id === item.id)
  if (found) found.qty += qty
  else items.push({ ...item, qty })
  save(items)
}

export function setQty(id: CartItem["id"], qty: number) {
  save(
    getCart()
      .map((item) => (item.id === id ? { ...item, qty } : item))
      .filter((item) => item.qty > 0)
  )
}

export const clearCart = () => save([])

/** Calls back on every change, also from other tabs; returns the unsubscribe function */
export function onCartChange(callback: () => void) {
  const storage = (event: StorageEvent) => event.key === KEY && callback()
  window.addEventListener(EVENT, callback)
  window.addEventListener("storage", storage)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener("storage", storage)
  }
}

export const formatRub = (amount: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount)
