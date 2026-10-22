import { useState, type SubmitEvent } from "react"
import { CreditCardIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice, startPayment } from "@/lib/payments"

interface Props {
  plan: string
  planId: string | number
  amount: number
  variant?: "default" | "outline"
}

export function PayDialog({ plan, planId, amount, variant }: Props) {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get("website")) return // honeypot for spam bots
    setSending(true)
    setError("")
    try {
      // Redirects to the payment page; the buyer comes back to /thanks
      await startPayment(planId, {
        name: String(form.get("name")),
        email: String(form.get("email")),
        phone: String(form.get("phone") ?? ""),
      })
    } catch (e) {
      setError((e as Error).message)
      setSending(false)
    }
  }

  return (
    <Dialog onOpenChange={(open) => open && setError("")}>
      <DialogTrigger asChild>
        <Button variant={variant} className="w-full">
          <CreditCardIcon data-icon="inline-start" />
          Оплатить {formatPrice(amount)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Оплата тарифа «{plan}»</DialogTitle>
            <DialogDescription>
              К оплате {formatPrice(amount)}. Чек придёт на e-mail.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="pay-name">Имя</Label>
            <Input id="pay-name" name="name" autoComplete="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pay-email">E-mail</Label>
            <Input
              id="pay-email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pay-phone">Телефон</Label>
            <Input
              id="pay-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+7"
            />
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
            <LockIcon data-icon="inline-start" />
            {sending ? "Переходим к оплате…" : "Перейти к оплате"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
