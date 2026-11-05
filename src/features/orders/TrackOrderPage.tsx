import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CompactFooter } from '@/components/layout/CompactFooter'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { arrivalLabel } from '@/features/checkout/arrival'
import { OrderTracker } from '@/features/checkout/components/OrderTracker'
import { ReviewForm } from '@/features/reviews/ReviewForm'
import { Stars } from '@/features/reviews/StarRating'
import { formatPrice } from '@/lib/format'
import { useOrder } from '@/services/orders/orders.queries'
import { useCartStore } from '@/stores/cart.store'
import { OrderLines } from './OrderLines'

interface TrackOrderPageProps {
  orderId: string
  trackingKey: string
  /** Set by Stripe when a bank sent the customer away to approve the payment. */
  paymentReturned: boolean
}

export const TrackOrderPage = ({ orderId, trackingKey, paymentReturned }: TrackOrderPageProps) => {
  const { data: order, isPending, isError } = useOrder(orderId, trackingKey)
  const clearCart = useCartStore((state) => state.clear)

  useEffect(() => {
    if (paymentReturned) clearCart()
  }, [paymentReturned, clearCart])

  if (isPending) return <StatusMessage title="Finding your order..." />
  if (isError || !order) {
    return (
      <StatusMessage
        title="We could not find that order"
        body="Please use the link from your confirmation email."
        action={
          <Link to="/menu" className={buttonStyles()}>
            See the menu
          </Link>
        }
      />
    )
  }

  return (
    <>
      <Container className="grid max-w-3xl gap-6 py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-jollof">Your order</p>
            <h1 className="text-4xl md:text-5xl">{order.number}</h1>
          </div>
          {!['delivered', 'cancelled'].includes(order.status) && (
            <p className="rounded-2xl bg-cocoa px-4 py-3 text-sm text-paper">
              Arrives <strong className="block text-lg">{arrivalLabel(order)}</strong>
            </p>
          )}
        </div>

        {order.status === 'pending-payment' ? (
          <p role="status" className="rounded-2xl bg-gold-soft p-4 text-sm font-semibold">
            We are waiting for your bank to confirm the payment. This page updates by itself.
          </p>
        ) : (
          <OrderTracker status={order.status} />
        )}

        {order.status === 'delivered' &&
          (order.review ? (
            <section className="rounded-card bg-shea p-5">
              <h2 className="text-xl">Thanks for your review</h2>
              <Stars rating={order.review.rating} className="mt-1" />
              {order.review.comment && <p className="mt-2 text-sm">“{order.review.comment}”</p>}
              {order.review.reply && (
                <p className="mt-3 border-l-2 border-jollof pl-3 text-sm">
                  <strong>Ugo replied:</strong> {order.review.reply}
                </p>
              )}
            </section>
          ) : (
            <ReviewForm orderId={order.id} trackingKey={trackingKey} items={order.items} />
          ))}

        <section className="rounded-card bg-paper p-5 shadow-sm">
          <h2 className="mb-1 text-xl">What you ordered</h2>
          <OrderLines items={order.items} />
          <dl className="mt-2 flex flex-col gap-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between font-semibold text-ewedu">
                <dt>Offer</dt>
                <dd>−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd>{order.deliveryFee ? formatPrice(order.deliveryFee) : 'Free'}</dd>
            </div>
            <div className="flex justify-between font-display text-lg font-extrabold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>
      </Container>
      <CompactFooter />
    </>
  )
}
