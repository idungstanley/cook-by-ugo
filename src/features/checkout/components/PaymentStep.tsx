import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { RadioCard } from '@/components/ui/RadioCard'
import { ASAP_LABEL } from '@/constants/checkout'
import { summariseItems } from '@/features/cart/cart.utils'
import { useCartTotals } from '@/hooks/useCartTotals'
import { formatPrice } from '@/lib/format'
import { useCreateOrder } from '@/services/orders/orders.queries'
import { useCartStore } from '@/stores/cart.store'
import { useCheckoutStore } from '@/stores/checkout.store'
import type { PaymentMethod } from '@/types'
import { cardSchema, type CardFormInput } from '../checkout.schema'
import { CardFields } from './CardFields'

export const PaymentStep = () => {
  const [method, setMethod] = useState<PaymentMethod>('card')
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clear)
  const delivery = useCheckoutStore((state) => state.delivery)
  const setStep = useCheckoutStore((state) => state.setStep)
  const completeOrder = useCheckoutStore((state) => state.completeOrder)
  const totals = useCartTotals()
  const createOrder = useCreateOrder()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormInput>({ resolver: zodResolver(cardSchema) })

  if (!delivery) return null

  const placeOrder = () =>
    createOrder.mutate(
      { items, totals, delivery, paymentMethod: method },
      {
        onSuccess: (order) => {
          completeOrder(order)
          clearCart()
        },
      },
    )

  const formattedTotal = formatPrice(totals.total)
  const eta = delivery.timing === 'scheduled' ? delivery.scheduledSlot : `ASAP, ${ASAP_LABEL}`

  return (
    <form
      noValidate
      onSubmit={
        method === 'card'
          ? handleSubmit(placeOrder)
          : (event) => {
              event.preventDefault()
              placeOrder()
            }
      }
      className="flex flex-1 flex-col gap-4 px-5 pb-6 sm:px-8"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-shea px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{summariseItems(items)}</p>
          <p className="text-xs text-muted">
            Delivery {totals.deliveryFee === 0 ? 'free' : formatPrice(totals.deliveryFee)} · {eta}
          </p>
        </div>
        <p className="font-display text-xl font-extrabold">{formattedTotal}</p>
      </div>

      <h3 className="text-xl">How would you like to pay?</h3>
      <div className="grid grid-cols-2 gap-3">
        <RadioCard
          name="payment-method"
          title="Card"
          description="Visa, Mastercard, Apple Pay"
          selected={method === 'card'}
          onSelect={() => setMethod('card')}
        />
        <RadioCard
          name="payment-method"
          title="Pay on delivery"
          description="Cash or card at the door"
          selected={method === 'on-delivery'}
          onSelect={() => setMethod('on-delivery')}
        />
      </div>

      {method === 'card' ? (
        <CardFields register={register} errors={errors} />
      ) : (
        <div className="rounded-2xl bg-gold-soft p-4">
          <p className="font-display text-xl font-extrabold">Have {formattedTotal} ready</p>
          <p className="mt-1 text-sm text-muted">
            Pay in cash or by card when your food arrives. Our rider carries a card machine.
          </p>
        </div>
      )}

      {createOrder.isError && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          We could not place your order. Please try again.
        </p>
      )}

      <div className="mt-auto pt-2 text-center">
        <Button type="submit" size="lg" fullWidth disabled={createOrder.isPending}>
          {createOrder.isPending
            ? 'Placing your order...'
            : method === 'card'
              ? `Pay ${formattedTotal}`
              : `Place order · ${formattedTotal}`}
        </Button>
        <p className="mt-2 text-xs text-muted">
          {method === 'card' && 'Secure payment · '}
          <button
            type="button"
            className="underline-offset-2 hover:underline"
            onClick={() => setStep('delivery')}
          >
            Back to delivery
          </button>
        </p>
      </div>
    </form>
  )
}
