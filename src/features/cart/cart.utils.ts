import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/constants/checkout'
import type { CartItem, CartTotals, NewCartItem } from '@/types'

export const addCartItem = (items: CartItem[], newItem: NewCartItem): CartItem[] => {
  const { optionKey, quantity = 1, ...item } = newItem
  const id = optionKey ? `${item.productId}:${optionKey}` : item.productId
  const existing = items.find((line) => line.id === id)

  if (existing) {
    return items.map((line) =>
      line.id === id ? { ...line, quantity: line.quantity + quantity } : line,
    )
  }
  return [...items, { ...item, id, quantity }]
}

export const updateCartItemQuantity = (items: CartItem[], itemId: string, quantity: number) =>
  quantity < 1
    ? items.filter(({ id }) => id !== itemId)
    : items.map((line) => (line.id === itemId ? { ...line, quantity } : line))

export const calculateCartTotals = (items: CartItem[]): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const qualifies = subtotal >= FREE_DELIVERY_THRESHOLD
  const deliveryFee = qualifies || itemCount === 0 ? 0 : DELIVERY_FEE

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    amountToFreeDelivery: Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0),
    freeDeliveryProgress: Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1),
  }
}

export const summariseItems = (items: CartItem[]) =>
  items.map(({ quantity, name }) => `${quantity} × ${name}`).join(', ')
