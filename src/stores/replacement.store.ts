import { create } from 'zustand'
import { addCartItem, updateCartItemQuantity } from '@/features/cart/cart.utils'
import type { CartItem, NewCartItem } from '@/types'

/**
 * Swaps for out-of-stock items. While an order is being changed, the dish pop-up adds here
 * instead of to the basket, so the basket is left alone.
 */
interface ReplacementState {
  orderId: string | null
  items: CartItem[]
  start: (orderId: string) => void
  addItem: (item: NewCartItem) => void
  setQuantity: (itemId: string, quantity: number) => void
  stop: () => void
}

export const useReplacementStore = create<ReplacementState>((set) => ({
  orderId: null,
  items: [],
  start: (orderId) => set({ orderId, items: [] }),
  addItem: (item) => set((state) => ({ items: addCartItem(state.items, item) })),
  setQuantity: (itemId, quantity) =>
    set((state) => ({ items: updateCartItemQuantity(state.items, itemId, quantity) })),
  stop: () => set({ orderId: null, items: [] }),
}))
