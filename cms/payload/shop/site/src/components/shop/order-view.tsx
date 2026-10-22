import { useEffect, useState } from "react"
import {
  CheckCircle2Icon,
  Clock3Icon,
  Loader2Icon,
  PackageCheckIcon,
  XCircleIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { formatRub } from "@/lib/cart"

type Order = {
  id: number | string
  status: "new" | "paid" | "processing" | "shipped" | "done" | "canceled"
  total: number
  payment: boolean
  items: { name: string; qty: number; price: number }[]
}

// The order page: reads ?order=<token>; while an online payment is being confirmed,
// asks the CMS again every 2 seconds for a minute.
export function OrderView({ cmsUrl, home }: { cmsUrl: string; home: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("order")
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    const check = async () => {
      try {
        if (!token) throw new Error("No order in the link")
        const response = await fetch(
          `${cmsUrl}/api/shop-orders/status?order=${encodeURIComponent(token)}`
        )
        if (!response.ok) throw new Error(String(response.status))
        const next = (await response.json()) as Order
        setOrder(next)
        if (next.status === "new" && next.payment && ++tries < 30)
          timer = setTimeout(check, 2000)
      } catch {
        setFailed(true)
      }
    }
    check()
    return () => clearTimeout(timer)
  }, [cmsUrl])

  let icon = (
    <Loader2Icon className="size-14 animate-spin text-muted-foreground" />
  )
  let title = "Загружаем заказ…"
  let text = ""
  if (failed) {
    icon = <XCircleIcon className="size-14 text-destructive" />
    title = "Заказ не найден"
    text = "Проверьте ссылку или свяжитесь с нами."
  } else if (order?.status === "canceled") {
    icon = <XCircleIcon className="size-14 text-destructive" />
    title = `Заказ №${order.id} отменён`
    text = "Если это ошибка — свяжитесь с нами."
  } else if (order && order.status === "new" && order.payment) {
    icon = <Clock3Icon className="size-14 text-muted-foreground" />
    title = `Заказ №${order.id}: ждём оплату`
    text = "Если вы уже оплатили, статус обновится автоматически."
  } else if (order && order.status === "new") {
    icon = <CheckCircle2Icon className="size-14 text-primary" />
    title = `Заказ №${order.id} принят`
    text = "Менеджер свяжется с вами для подтверждения."
  } else if (order) {
    icon = <PackageCheckIcon className="size-14 text-primary" />
    title =
      order.status === "paid"
        ? `Заказ №${order.id} оплачен`
        : `Заказ №${order.id}: ${order.status === "shipped" ? "отгружен" : order.status === "done" ? "выполнен" : "в работе"}`
    text = "Спасибо за покупку! Мы свяжемся с вами по доставке."
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
      {icon}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
      {order && (
        <ul className="w-full divide-y rounded-xl border text-left text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-4 p-3">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatRub(item.price * item.qty)}</span>
            </li>
          ))}
          <li className="flex justify-between p-3 font-semibold">
            <span>Итого</span>
            <span>{formatRub(order.total)}</span>
          </li>
        </ul>
      )}
      <a href={home} className={buttonVariants({ variant: "outline" })}>
        Вернуться в каталог
      </a>
    </div>
  )
}
