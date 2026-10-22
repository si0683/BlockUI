import { OrderDialog } from "@/components/site/order-dialog"
import { PayDialog } from "@/components/site/pay-dialog"

interface Props {
  plan: string
  /** Plan id in the CMS */
  planId?: string | number
  /** Price for online payment, in rubles; empty — the plan is not paid online */
  amount?: number
  popular?: boolean
}

// The button under a pricing card: online payment when the plan has an amount in the CMS,
// otherwise the order form (e.g. "от 90 000 ₽" plans or when the CMS is not running).
export function PlanAction({ plan, planId, amount, popular }: Props) {
  const variant = popular ? "default" : "outline"
  if (planId !== undefined && amount) {
    return (
      <PayDialog
        plan={plan}
        planId={planId}
        amount={amount}
        variant={variant}
      />
    )
  }
  return (
    <OrderDialog
      label="Выбрать"
      plan={plan}
      variant={variant}
      className="w-full"
    />
  )
}
