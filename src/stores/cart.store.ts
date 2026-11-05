import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addCartItem, updateCartItemQuantity } from '@/features/cart/cart.utils'
import type { CartItem, NewCartItem } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (item: NewCartItem) => void
  setQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: addCartItem(state.items, item) })),
      setQuantity: (itemId, quantity) =>
        set((state) => ({ items: updateCartItemQuantity(state.items, itemId, quantity) })),
      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter(({ id }) => id !== itemId) })),
      clear: () => set({ items: [] }),
    }),
    // The key changes whenever a basket line's shape does, so old baskets never break the page.
    { name: 'cook-by-ugo-cart-v3' },
  ),
)
