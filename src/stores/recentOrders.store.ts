import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentOrder {
  id: string
  number: string
  trackingKey: string
  placedAt: number
}

const KEEP = 10

interface RecentOrdersState {
  orders: RecentOrder[]
  remember: (order: RecentOrder) => void
}

/**
 * Orders placed on this device, newest first, so a guest can always get back to tracking
 * even after closing or refreshing the page.
 */
export const useRecentOrdersStore = create<RecentOrdersState>()(
  persist(
    (set) => ({
      orders: [],
      remember: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter(({ id }) => id !== order.id)].slice(0, KEEP),
        })),
    }),
    { name: 'cook-by-ugo-recent-orders' },
  ),
)
