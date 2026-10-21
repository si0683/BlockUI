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

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    // Send the form to your backend here, for example:
    // fetch("/api/order", { method: "POST", body: new FormData(event.currentTarget) })
    setSent(true)
  }

  return (
    <Dialog onOpenChange={(open) => open && setSent(false)}>
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
            <Button type="submit" size="lg">
              <SendIcon data-icon="inline-start" />
              Отправить
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
