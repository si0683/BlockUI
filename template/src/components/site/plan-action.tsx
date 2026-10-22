import { OrderDialog } from "@/components/site/order-dialog"

interface Props {
  plan: string
  /** Plan id in the CMS (with --cms=payload) */
  planId?: string | number
  /** Price for online payment, in rubles (with --pay) */
  amount?: number
  popular?: boolean
}

// The button under a pricing card. Here it opens the order form;
// a project created with --pay=yookassa|stripe replaces this file with online payment.
export function PlanAction({ plan, popular }: Props) {
  return (
    <OrderDialog
      label="Выбрать"
      plan={plan}
      variant={popular ? "default" : "outline"}
      className="w-full"
    />
  )
}
