import { useMemo } from 'react'
import { calculateCartTotals } from '@/features/cart/cart.utils'
import { useCartStore } from '@/stores/cart.store'

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items)
  return useMemo(() => calculateCartTotals(items), [items])
}
