import { useEffect, useState } from "react"
import {
  CheckCircle2Icon,
  Clock3Icon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { formatPrice, getOrderStatus, type OrderStatus } from "@/lib/payments"

// The "thanks" page body: reads ?order=<token> and asks the CMS for the status
// every 2 seconds for a minute (the payment may take a moment to confirm).
export function PaymentStatus({ home }: { home: string }) {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("order")
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    const check = async () => {
      try {
        if (!token) throw new Error("No order in the link")
        const next = await getOrderStatus(token)
        setOrder(next)
        if (next.status === "pending" && ++tries < 30)
          timer = setTimeout(check, 2000)
      } catch {
        setFailed(true)
      }
    }
    check()
    return () => clearTimeout(timer)
  }, [])

  let icon = (
    <Loader2Icon className="size-14 animate-spin text-muted-foreground" />
  )
  let title = "Проверяем оплату…"
  let text = "Это займёт несколько секунд."
  if (failed) {
    icon = <XCircleIcon className="size-14 text-destructive" />
    title = "Заказ не найден"
    text = "Проверьте ссылку или свяжитесь с нами."
  } else if (order?.status === "paid") {
    icon = <CheckCircle2Icon className="size-14 text-primary" />
    title = "Спасибо, оплата прошла!"
    text = `Тариф «${order.plan}», ${formatPrice(order.amount, order.currency)}. Мы свяжемся с вами в ближайшее время, чек придёт на e-mail.`
  } else if (order?.status === "canceled") {
    icon = <XCircleIcon className="size-14 text-destructive" />
    title = "Оплата не прошла"
    text = "Деньги не списаны. Попробуйте ещё раз или выберите другой способ."
  } else if (order) {
    icon = <Clock3Icon className="size-14 text-muted-foreground" />
    title = "Ждём подтверждение оплаты"
    text = `Тариф «${order.plan}». Если вы оплатили, статус обновится автоматически.`
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {icon}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-md text-muted-foreground">{text}</p>
      <a href={home} className={buttonVariants({ variant: "outline" })}>
        На главную
      </a>
    </div>
  )
}
