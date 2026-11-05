import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { Appearance } from '@stripe/stripe-js'
import { Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { useCartLines } from '@/hooks/useCartTotals'
import { formatPrice } from '@/lib/format'
import { getStripe } from '@/lib/stripe'
import { useCreateOrder, useOrderQuote } from '@/services/orders/orders.queries'
import { useDeliverySlots, useSiteInfo } from '@/services/site/site.queries'
import { useCartStore } from '@/stores/cart.store'
import { useCheckoutStore } from '@/stores/checkout.store'
import type { OrderQuote, PlacedOrder } from '@/types'
import { arrivalLabel } from '../arrival'

/** Stripe's form in the site's colours and fonts. */
const APPEARANCE: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#C8401C',
    colorText: '#1C0F0A',
    colorBackground: '#F6EDE0',
    colorDanger: '#A83315',
    fontFamily: 'Manrope Variable, system-ui, sans-serif',
    borderRadius: '16px',
  },
}

const PAID_STATUSES = ['succeeded', 'processing', 'requires_capture']

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

interface PayFormProps {
  placed: PlacedOrder
  onPaid: () => void
}

const PayForm = ({ placed, onPaid }: PayFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  const pay = async (event: FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return
    setPaying(true)
    setError(null)
    // Some banks send the customer away to approve; they come back to their tracking page.
    const returnUrl = `${window.location.origin}/track/${placed.order.id}?key=${encodeURIComponent(placed.trackingKey)}`
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    })
    setPaying(false)

    if (result.error) {
      setError(result.error.message ?? 'Your payment did not go through. Please try again.')
      return
    }
    if (PAID_STATUSES.includes(result.paymentIntent.status)) onPaid()
    else setError('Your payment was not completed. Please try again.')
  }

  return (
    <form onSubmit={(event) => void pay(event)} className="flex flex-1 flex-col gap-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && (
        <p role="alert" className="text-sm font-semibold text-jollof">
          {error}
        </p>
      )}
      <div className="mt-auto pt-2 text-center">
        <Button type="submit" size="lg" fullWidth disabled={!stripe || paying}>
          {paying ? 'Paying...' : `Pay ${formatPrice(placed.order.total)}`}
        </Button>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
          <Lock className="size-3" /> Secure payment by Stripe. We never see your card details.
        </p>
      </div>
    </form>
  )
}

/** Every order is paid for at checkout. The order is created first, then Stripe takes payment. */
export const PaymentStep = () => {
  const clearCart = useCartStore((state) => state.clear)
  const delivery = useCheckoutStore((state) => state.delivery)
  const setStep = useCheckoutStore((state) => state.setStep)
  const completeOrder = useCheckoutStore((state) => state.completeOrder)
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

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-6 sm:px-8">
      <OrderSummary quote={quote.data} eta={eta} />

      {placed?.clientSecret && publishableKey ? (
        <>
          <h3 className="text-xl">Pay by card</h3>
          <Elements
            stripe={getStripe(publishableKey)}
            options={{ clientSecret: placed.clientSecret, appearance: APPEARANCE }}
          >
            <PayForm placed={placed} onPaid={() => finish(placed)} />
          </Elements>
        </>
      ) : (
        <>
          {errorMessage && (
            <p role="alert" className="text-sm font-semibold text-jollof">
              {errorMessage}
            </p>
          )}
          <div className="mt-auto pt-2 text-center">
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
            <p className="mt-2 text-xs text-muted">
              Card, Apple Pay or Google Pay ·{' '}
              <button
                type="button"
                className="underline-offset-2 hover:underline"
                onClick={() => setStep('delivery')}
              >
                Back to delivery
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  )
}
