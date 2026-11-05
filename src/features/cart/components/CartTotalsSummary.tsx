import { formatPrice } from '@/lib/format'
import type { AppliedOffer, CartTotals } from '@/types'

export const FreeDeliveryBar = ({ totals }: { totals: CartTotals }) => {
  const unlocked = totals.amountToFreeDelivery === 0

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ewedu">
        {unlocked
          ? 'Free delivery unlocked'
          : `Add ${formatPrice(totals.amountToFreeDelivery)} more for free delivery`}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-ewedu transition-[width]"
          style={{ width: `${totals.freeDeliveryProgress * 100}%` }}
        />
      </div>
    </div>
  )
}

interface CartTotalsSummaryProps {
  totals: CartTotals
  appliedOffers?: AppliedOffer[]
}

export const CartTotalsSummary = ({ totals, appliedOffers = [] }: CartTotalsSummaryProps) => (
  <dl className="flex flex-col gap-2 text-sm">
    <div className="flex justify-between">
      <dt className="text-muted">Subtotal</dt>
      <dd>{formatPrice(totals.subtotal)}</dd>
    </div>
    {totals.discount > 0 && (
      <div className="flex justify-between font-semibold text-ewedu">
        <dt>{appliedOffers.find(({ discount }) => discount > 0)?.name ?? 'Offer'}</dt>
        <dd>−{formatPrice(totals.discount)}</dd>
      </div>
    )}
    <div className="flex justify-between border-b border-line pb-3">
      <dt className="text-muted">Delivery (estimate)</dt>
      <dd className={totals.deliveryFee === 0 ? 'font-semibold text-ewedu' : ''}>
        {totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}
      </dd>
    </div>
    <div className="flex items-center justify-between pt-1">
      <dt className="font-display text-lg font-extrabold">Estimated total</dt>
      <dd className="font-display text-2xl font-extrabold">{formatPrice(totals.total)}</dd>
    </div>
  </dl>
)
