import { useEffect } from 'react'
import { refreshCartItems } from '@/features/cart/cart.utils'
import { useDeals } from '@/services/deals/deals.queries'
import { useDishes, useOptionGroups } from '@/services/menu/menu.queries'
import { useCartStore } from '@/stores/cart.store'

/** Keeps a saved basket in step with the menu, so changed prices show before checkout. */
export const useFreshCartPrices = () => {
  const items = useCartStore((state) => state.items)
  const replaceItems = useCartStore((state) => state.replaceItems)
  const { data: dishes } = useDishes()
  const { data: groups } = useOptionGroups()
  const { data: deals } = useDeals()

  useEffect(() => {
    if (!dishes || !groups || items.length === 0) return
    const fresh = refreshCartItems(items, dishes, groups, deals ?? [])
    if (fresh !== items) replaceItems(fresh)
  }, [items, dishes, groups, deals, replaceItems])
}
