import { useEffect, useState, type SubmitEvent } from "react"
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  clearCart,
  formatRub,
  getCart,
  onCartChange,
  setQty,
  type CartItem,
} from "@/lib/cart"

interface Props {
  cmsUrl: string
  base: string
}

// The cart and the checkout form. The CMS checks prices and stock again,
// creates the order and returns where to go: the payment page or the order page.
export function CartView({ cmsUrl, base }: Props) {
  const [items, setItems] = useState<CartItem[] | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const update = () => setItems(getCart())
    const unsubscribe = onCartChange(update)
    update()
    return unsubscribe
  }, [])

  if (items === null) return null

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <ShoppingBagIcon className="size-12 text-muted-foreground" />
        <p className="text-lg">Корзина пуста</p>
        <a href={`${base}/catalog/`} className={buttonVariants()}>
          Перейти в каталог
        </a>
      </div>
    )
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get("website")) return // honeypot for spam bots
    setSending(true)
    setError("")
    try {
      const response = await fetch(`${cmsUrl}/api/shop-orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items!.map((item) => ({ id: item.id, qty: item.qty })),
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          address: form.get("address"),
          comment: form.get("comment"),
          returnUrl: new URL(`${base}/order/`, window.location.origin).href,
        }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        url?: string
        error?: string
      }
      if (!response.ok || !data.url)
        throw new Error(data.error || "Не удалось оформить заказ")
      clearCart()
      window.location.href = data.url
    } catch (e) {
      setError((e as Error).message)
      setSending(false)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y rounded-xl border">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 p-4">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="size-16 rounded-lg object-cover"
              />
            ) : (
              <div className="size-16 rounded-lg bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <a
                href={`${base}/product/${item.slug}/`}
                className="font-medium hover:underline"
              >
                {item.name}
              </a>
              <p className="text-sm text-muted-foreground">
                {formatRub(item.price)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Меньше"
                onClick={() => setQty(item.id, item.qty - 1)}
              >
                <MinusIcon />
              </Button>
              <span className="w-8 text-center tabular-nums">{item.qty}</span>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Больше"
                onClick={() => setQty(item.id, item.qty + 1)}
              >
                <PlusIcon />
              </Button>
            </div>
            <p className="hidden w-24 text-right font-medium sm:block">
              {formatRub(item.price * item.qty)}
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Удалить"
              onClick={() => setQty(item.id, 0)}
            >
              <Trash2Icon />
            </Button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={submit}
        className="grid h-fit gap-4 rounded-xl border p-5"
      >
        <p className="flex justify-between text-lg font-semibold">
          <span>Итого</span>
          <span>{formatRub(total)}</span>
        </p>
        <div className="grid gap-2">
          <Label htmlFor="cart-name">Имя</Label>
          <Input id="cart-name" name="name" autoComplete="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cart-phone">Телефон</Label>
          <Input
            id="cart-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cart-email">E-mail (для чека)</Label>
          <Input
            id="cart-email"
            name="email"
            type="email"
            autoComplete="email"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cart-address">Адрес доставки</Label>
          <Textarea id="cart-address" name="address" rows={2} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cart-comment">Комментарий</Label>
          <Textarea id="cart-comment" name="comment" rows={2} />
        </div>
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? "Оформляем…" : "Оформить заказ"}
        </Button>
      </form>
    </div>
  )
}
