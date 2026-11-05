import { useMemo } from 'react'
import { calculateCartTotals } from '@/features/cart/cart.utils'
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

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items)
  const lines = useCartLines()
  const { data: site } = useSiteInfo()
  const { data: quote } = useOrderQuote(lines)
  const threshold = site?.freeDeliveryThreshold
  const discount = quote?.discount ?? 0
  const freeDeliveryOffer = quote?.appliedOffers.some(({ freeDelivery }) => freeDelivery) ?? false

  return {
    ...useMemo(
      () => calculateCartTotals(items, threshold, discount, freeDeliveryOffer),
      [items, threshold, discount, freeDeliveryOffer],
    ),
    appliedOffers: quote?.appliedOffers ?? [],
  }
}
