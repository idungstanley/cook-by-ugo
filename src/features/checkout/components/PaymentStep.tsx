import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { RadioCard } from '@/components/ui/RadioCard'
import { ASAP_LABEL } from '@/constants/checkout'
import { summariseItems } from '@/features/cart/cart.utils'
import { formatPrice } from '@/lib/format'
import { useCreateOrder, useOrderQuote } from '@/services/orders/orders.queries'
import { useDeliverySlots, useSiteInfo } from '@/services/site/site.queries'
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
  const createOrder = useCreateOrder()
  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const [unfinishedPayment, setUnfinishedPayment] = useState(false)
  const lines = useMemo(
    () => items.map(({ productId, quantity, selection }) => ({ productId, quantity, selection })),
    [items],
  )
  const quote = useOrderQuote(lines, delivery?.postcode ?? '')
  const { data: site } = useSiteInfo()
  const { data: slots } = useDeliverySlots()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormInput>({ resolver: zodResolver(cardSchema) })

  if (!delivery) return null

  const { postcode, timing, ...details } = delivery
  const totals = quote.data
  const slotLabel = slots?.find(({ at }) => at === delivery.scheduledFor)?.label
  const eta = timing === 'scheduled' && slotLabel ? slotLabel : `ASAP, ${ASAP_LABEL}`

  const placeOrder = () =>
    createOrder.mutate(
      {
        idempotencyKey,
        items: lines,
        postcode,
        paymentMethod: method,
        delivery: {
          ...details,
          scheduledFor: timing === 'scheduled' ? details.scheduledFor : undefined,
        },
      },
      {
        onSuccess: ({ order, trackingKey }) => {
          // A pending order needs Stripe's payment form, so it must not look like a success.
          if (order.status === 'pending-payment') {
            setUnfinishedPayment(true)
            return
          }
          completeOrder({
            ...order,
            trackingKey,
            etaLabel: timing === 'scheduled' && slotLabel ? slotLabel : `${order.etaMinutes} min`,
          })
          clearCart()
        },
      },
    )

  const formattedTotal = totals ? formatPrice(totals.total) : ''
  const errorMessage =
    quote.error?.message ??
    createOrder.error?.message ??
    (unfinishedPayment ? 'Card payment is not available yet. Please pay on delivery.' : null)

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
            {totals &&
              `Delivery ${totals.deliveryFee === 0 ? 'free' : formatPrice(totals.deliveryFee)} · `}
            {eta}
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
          disabled={site?.cardEnabled === false}
          selected={method === 'card'}
          onSelect={() => setMethod('card')}
        />
        <RadioCard
          name="payment-method"
          title="Pay on delivery"
          description="Cash or card at the door"
          disabled={site?.payOnDeliveryEnabled === false}
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

      {errorMessage && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {errorMessage}
        </p>
      )}

      <div className="mt-auto pt-2 text-center">
        <Button type="submit" size="lg" fullWidth disabled={createOrder.isPending || !totals}>
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
