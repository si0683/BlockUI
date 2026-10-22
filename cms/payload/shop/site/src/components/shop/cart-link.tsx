import { useEffect, useState } from "react"
import { ShoppingCartIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getCart, onCartChange } from "@/lib/cart"

// Header cart icon with the number of items
export function CartLink({ href }: { href: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () =>
      setCount(getCart().reduce((sum, item) => sum + item.qty, 0))
    const unsubscribe = onCartChange(update)
    update()
    return unsubscribe
  }, [])

  return (
    <a
      href={href}
      aria-label="Корзина"
      className={`relative ${buttonVariants({ variant: "ghost", size: "icon" })}`}
    >
      <ShoppingCartIcon />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] leading-5 font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </a>
  )
}
