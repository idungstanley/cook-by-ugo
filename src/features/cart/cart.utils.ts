import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/constants/checkout'
import type { CartItem, CartTotals, NewCartItem } from '@/types'

export const addCartItem = (items: CartItem[], newItem: NewCartItem): CartItem[] => {
  const { optionKey, quantity = 1, selection = {}, ...item } = newItem
  const id = optionKey ? `${item.productId}:${optionKey}` : item.productId
  const existing = items.find((line) => line.id === id)

  if (existing) {
    return items.map((line) =>
      line.id === id ? { ...line, quantity: line.quantity + quantity } : line,
    )
  }
  return [...items, { ...item, id, quantity, selection }]
}

export const updateCartItemQuantity = (items: CartItem[], itemId: string, quantity: number) =>
  quantity < 1
    ? items.filter(({ id }) => id !== itemId)
    : items.map((line) => (line.id === itemId ? { ...line, quantity } : line))

/** A guide for the basket. Checkout shows the server's price for the customer's postcode. */
export const calculateCartTotals = (
  items: CartItem[],
  freeDeliveryThreshold = FREE_DELIVERY_THRESHOLD,
): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const qualifies = subtotal >= freeDeliveryThreshold
  const deliveryFee = qualifies || itemCount === 0 ? 0 : DELIVERY_FEE

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    amountToFreeDelivery: Math.max(freeDeliveryThreshold - subtotal, 0),
    freeDeliveryProgress: Math.min(subtotal / freeDeliveryThreshold, 1),
  }
}

export const summariseItems = (items: CartItem[]) =>
  items.map(({ quantity, name }) => `${quantity} × ${name}`).join(', ')
