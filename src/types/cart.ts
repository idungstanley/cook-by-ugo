import type { Pence } from './menu'

/** A chosen option shown as its own line under the dish, with its own price. */
export interface CartItemOption {
  groupTitle: string
  label: string
  price: Pence
}

export interface CartItem {
  /** Same dish with the same options and note shares a line, so the id is derived from all three. */
  id: string
  productId: string
  name: string
  image: string
  /** The dish on its own, before options. */
  basePrice: Pence
  options: CartItemOption[]
  unitPrice: Pence
  quantity: number
  summary?: string
  /** How the customer wants it, such as "not too spicy". */
  note?: string
  /** Chosen option ids by group. The server prices the order from these. */
  selection: Record<string, string[]>
}

export type NewCartItem = Omit<
  CartItem,
  'id' | 'quantity' | 'selection' | 'basePrice' | 'options'
> & {
  quantity?: number
  optionKey?: string
  selection?: Record<string, string[]>
  basePrice?: Pence
  options?: CartItemOption[]
}

export interface CartTotals {
  itemCount: number
  subtotal: Pence
  discount: Pence
  deliveryFee: Pence
  total: Pence
  amountToFreeDelivery: Pence
  freeDeliveryProgress: number
}
