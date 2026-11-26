import { useMemo } from 'react'
import { calculateCartTotals } from '@/features/cart/cart.utils'
import { useAccount } from '@/services/account/account.queries'
import { useOrderQuote } from '@/services/orders/orders.queries'
import { useSiteInfo } from '@/services/site/site.queries'
import { useCartStore } from '@/stores/cart.store'

/** The basket's own lines, without delivery, so offers show before a postcode is known. */
export const useCartLines = () => {
  const items = useCartStore((state) => state.items)
  return useMemo(
    () =>
      items.map(({ productId, quantity, selection, note }) => ({
        productId,
        quantity,
        selection,
        note,
      })),
    [items],
  )
}

/**
 * Basket totals. A signed-in customer with a saved address gets delivery priced for their
 * postcode by the server. Everyone else sees delivery worked out at checkout, never a guess.
 */
export const useCartTotals = () => {
  const items = useCartStore((state) => state.items)
  const lines = useCartLines()
  const { data: site } = useSiteInfo()
  const { data: account } = useAccount()
  const postcode = account?.address?.postcode
  const basketQuote = useOrderQuote(lines)
  const addressQuote = useOrderQuote(postcode ? lines : [], postcode)
  const quote = basketQuote.data
  const threshold = site?.freeDeliveryThreshold ?? undefined
  const discount = quote?.discount ?? 0
  const freeDeliveryOffer = quote?.appliedOffers.some(({ freeDelivery }) => freeDelivery) ?? false
  const priced = postcode && !addressQuote.isError ? addressQuote.data : undefined

  const totals = useMemo(
    () => calculateCartTotals(items, threshold ?? Infinity, discount, freeDeliveryOffer),
    [items, threshold, discount, freeDeliveryOffer],
  )

  // Free delivery from an offer or the shop's threshold is free for every postcode.
  const alreadyFree = totals.itemCount > 0 && totals.deliveryFee === 0

  return {
    ...totals,
    freeDeliveryOn: threshold != null,
    deliveryKnown: Boolean(priced) || alreadyFree,
    deliveryFee: priced ? priced.deliveryFee : 0,
    total: priced ? priced.total : totals.subtotal - totals.discount,
    appliedOffers: quote?.appliedOffers ?? [],
  }
}
