import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCartLines } from '@/hooks/useCartTotals'
import { formatPrice } from '@/lib/format'
import { useCreateOrder, useOrderQuote } from '@/services/orders/orders.queries'
import { useDeliverySlots, useSiteInfo } from '@/services/site/site.queries'
import { useCartStore } from '@/stores/cart.store'
import { useCheckoutStore } from '@/stores/checkout.store'
import { useRecentOrdersStore } from '@/stores/recentOrders.store'
import type { OrderQuote, PlacedOrder } from '@/types'
import { arrivalLabel } from '../arrival'
import { StripePayment } from './StripePayment'

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div
    className={accent ? 'flex justify-between font-semibold text-ewedu' : 'flex justify-between'}
  >
    <dt className={accent ? undefined : 'text-muted'}>{label}</dt>
    <dd>{value}</dd>
  </div>
)

const OrderSummary = ({ quote, eta }: { quote?: OrderQuote; eta: string }) => {
  const items = useCartStore((state) => state.items)
  const offerName = quote?.appliedOffers.find(({ discount }) => discount > 0)?.name

  return (
    <section className="rounded-2xl bg-shea px-4 py-3 text-sm">
      <ul className="flex flex-col gap-1.5 border-b border-line pb-3">
        {items.map((item) => (
          <li key={item.id}>
            <div className="flex justify-between gap-3 font-semibold">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
            {item.options.length > 0 && (
              <p className="text-xs text-muted">
                {item.options.map(({ label }) => label).join(' · ')}
              </p>
            )}
            {item.note && <p className="text-xs italic text-muted">“{item.note}”</p>}
          </li>
        ))}
      </ul>
      {quote && (
        <dl className="flex flex-col gap-1 pt-3">
          <Row label="Subtotal" value={formatPrice(quote.subtotal)} />
          {quote.discount > 0 && (
            <Row accent label={offerName ?? 'Offer'} value={`−${formatPrice(quote.discount)}`} />
          )}
          <Row
            label="Delivery"
            value={quote.deliveryFee === 0 ? 'Free' : formatPrice(quote.deliveryFee)}
          />
          <div className="flex justify-between pt-1 font-display text-lg font-extrabold">
            <dt>Total</dt>
            <dd>{formatPrice(quote.total)}</dd>
          </div>
        </dl>
      )}
      <p className="mt-2 text-xs text-muted">Arrives {eta}</p>
    </section>
  )
}

/** Every order is paid for at checkout. The order is created first, then Stripe takes payment. */
export const PaymentStep = () => {
  const clearCart = useCartStore((state) => state.clear)
  const delivery = useCheckoutStore((state) => state.delivery)
  const setStep = useCheckoutStore((state) => state.setStep)
  const completeOrder = useCheckoutStore((state) => state.completeOrder)
  const rememberOrder = useRecentOrdersStore((state) => state.remember)
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  // A failed attempt gets a fresh key, so trying again places a new order instead of the old one.
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID())
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const lines = useCartLines()
  const quote = useOrderQuote(lines, delivery?.postcode)
  const { data: site } = useSiteInfo()
  const { data: slots } = useDeliverySlots()

  if (!delivery) return null

  const { postcode, timing, ...details } = delivery
  const slotLabel = slots?.find(({ at }) => at === delivery.scheduledFor)?.label
  const eta =
    timing === 'scheduled' && slotLabel
      ? slotLabel.replace('Today, ', 'today at ')
      : `in about ${site?.leadMinutes ?? 45} minutes`

  const finish = (order: PlacedOrder) => {
    rememberOrder({
      id: order.order.id,
      number: order.order.number,
      trackingKey: order.trackingKey,
      placedAt: Date.now(),
    })
    // The page behind the confirmation moves to the tracking page, so a refresh keeps the order.
    void navigate({
      to: '/track/$orderId',
      params: { orderId: order.order.id },
      search: { key: order.trackingKey },
      replace: true,
    })
    completeOrder({
      id: order.order.id,
      number: order.order.number,
      status: 'received',
      trackingKey: order.trackingKey,
      etaLabel: arrivalLabel(order.order),
    })
    clearCart()
  }

  const startPayment = () =>
    createOrder.mutate(
      {
        idempotencyKey,
        items: lines,
        postcode,
        delivery: {
          ...details,
          scheduledFor: timing === 'scheduled' ? details.scheduledFor : undefined,
        },
      },
      {
        onSuccess: (order) => {
          // Without Stripe, in local development, the order is already confirmed.
          if (!order.clientSecret) finish(order)
          else setPlaced(order)
        },
        onError: () => setIdempotencyKey(crypto.randomUUID()),
      },
    )

  const publishableKey = site?.stripePublishableKey
  const errorMessage =
    quote.error?.message ??
    createOrder.error?.message ??
    (placed && !publishableKey ? 'Card payments are not set up yet. Please try again later.' : null)

  const backToDelivery = () => setStep('delivery')
  const closed = /closed right now|schedule/i.test(errorMessage ?? '')

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-6 sm:px-8">
      <button
        type="button"
        onClick={backToDelivery}
        className="inline-flex items-center gap-1.5 self-start rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold transition hover:border-cocoa"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to delivery details
      </button>

      <OrderSummary quote={quote.data} eta={eta} />

      {placed?.clientSecret && publishableKey ? (
        <>
          <h3 className="text-xl">Pay by card</h3>
          <StripePayment
            publishableKey={publishableKey}
            clientSecret={placed.clientSecret}
            amount={placed.order.total}
            // Some banks send the customer away to approve; they come back to their tracking page.
            returnUrl={`${window.location.origin}/track/${placed.order.id}?key=${encodeURIComponent(placed.trackingKey)}`}
            onPaid={() => finish(placed)}
          />
        </>
      ) : (
        <>
          {errorMessage && (
            <div role="alert" className="flex flex-col items-start gap-3">
              <p className="text-sm font-semibold text-jollof">{errorMessage}</p>
              {closed && (
                <Button variant="outline" onClick={backToDelivery}>
                  <ArrowLeft className="size-4" aria-hidden /> Choose a delivery time
                </Button>
              )}
            </div>
          )}
          <div className="mt-auto flex flex-col gap-2 pt-2 text-center">
            <Button
              size="lg"
              fullWidth
              disabled={createOrder.isPending || !quote.data || Boolean(placed)}
              onClick={startPayment}
            >
              {createOrder.isPending
                ? 'Getting payment ready...'
                : `Continue to pay ${quote.data ? formatPrice(quote.data.total) : ''}`}
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={backToDelivery}>
              Back
            </Button>
            <p className="text-xs text-muted">Card, Apple Pay or Google Pay</p>
          </div>
        </>
      )}
    </div>
  )
}
