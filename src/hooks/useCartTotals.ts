import { useMemo } from 'react'
import { calculateCartTotals } from '@/features/cart/cart.utils'
import { useSiteInfo } from '@/services/site/site.queries'
import { useCartStore } from '@/stores/cart.store'

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items)
  const { data: site } = useSiteInfo()
  const threshold = site?.freeDeliveryThreshold

  return useMemo(() => calculateCartTotals(items, threshold), [items, threshold])
}
