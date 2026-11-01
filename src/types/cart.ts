import type { Pence } from './menu'

export interface CartItem {
  /** Same dish with the same options shares a line, so the id is derived from both. */
  id: string
  productId: string
  name: string
  image: string
  unitPrice: Pence
  quantity: number
  summary?: string
}

export type NewCartItem = Omit<CartItem, 'id' | 'quantity'> & {
  quantity?: number
  optionKey?: string
}

export interface CartTotals {
  itemCount: number
  subtotal: Pence
  deliveryFee: Pence
  total: Pence
  amountToFreeDelivery: Pence
  freeDeliveryProgress: number
}
