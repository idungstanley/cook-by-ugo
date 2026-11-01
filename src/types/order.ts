import type { CartItem, CartTotals } from './cart'

export type PaymentMethod = 'card' | 'on-delivery'

export type DeliveryTiming = 'asap' | 'scheduled'

export interface DeliveryDetails {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  timing: DeliveryTiming
  scheduledSlot?: string
  note?: string
}

export type OrderStatus = 'received' | 'preparing' | 'out-for-delivery' | 'delivered'

export interface CreateOrderInput {
  items: CartItem[]
  totals: CartTotals
  delivery: DeliveryDetails
  paymentMethod: PaymentMethod
}

export interface Order extends CreateOrderInput {
  id: string
  number: string
  status: OrderStatus
  etaLabel: string
  createdAt: number
}
