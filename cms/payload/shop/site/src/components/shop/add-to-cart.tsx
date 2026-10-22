import { useState } from "react"
import { CheckIcon, ShoppingCartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { addToCart, type CartItem } from "@/lib/cart"

interface Props {
  product: Omit<CartItem, "qty">
  stock: number
  size?: "default" | "lg"
  className?: string
}

export function AddToCart({
  product,
  stock,
  size = "default",
  className,
}: Props) {
  const [added, setAdded] = useState(false)

  if (stock <= 0) {
    return (
      <Button size={size} variant="outline" disabled className={className}>
        Нет в наличии
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={() => {
        addToCart(product)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      }}
    >
      {added ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <ShoppingCartIcon data-icon="inline-start" />
      )}
      {added ? "В корзине" : "В корзину"}
    </Button>
  )
}
