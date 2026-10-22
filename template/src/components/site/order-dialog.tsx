import { useState, type SubmitEvent } from "react"
import { CheckCircle2Icon, SendIcon } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { sendLead } from "@/lib/leads"

interface Props {
  label?: string
  plan?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "lg"
  className?: string
}

export function OrderDialog({
  label = "Оставить заявку",
  plan,
  variant,
  size = "lg",
  className,
}: Props) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    // Honeypot: people never see this field, spam bots fill it in
    if (form.get("website")) return setSent(true)
    setSending(true)
    setError(false)
    try {
      // src/lib/leads.ts decides where the lead goes
      await sendLead({
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        message: String(form.get("message") ?? ""),
        plan,
      })
      setSent(true)
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) return
        setSent(false)
        setError(false)
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2Icon className="size-12 text-primary" />
            <DialogTitle>Заявка отправлена</DialogTitle>
            <DialogDescription>
              Мы перезвоним в течение 15 минут.
            </DialogDescription>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{plan ? `Тариф «${plan}»` : "Заявка"}</DialogTitle>
              <DialogDescription>
                Оставьте контакты — обсудим ваш проект.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="order-name">Имя</Label>
              <Input id="order-name" name="name" autoComplete="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order-phone">Телефон</Label>
              <Input
                id="order-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+7"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order-message">Комментарий</Label>
              <Textarea id="order-message" name="message" rows={3} />
            </div>
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            {error && (
              <p className="text-sm text-destructive">
                Не удалось отправить. Попробуйте ещё раз или позвоните нам.
              </p>
            )}
            <Button type="submit" size="lg" disabled={sending}>
              <SendIcon data-icon="inline-start" />
              {sending ? "Отправляю…" : "Отправить"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
