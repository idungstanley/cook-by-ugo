import type { CartItem } from './cart'
import type { Pence } from './menu'

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
  scheduledFor?: number
  note?: string
  allergyNote?: string
  marketingOptIn: boolean
}

export type OrderStatus =
  'pending-payment' | 'received' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled'

export type OrderLineInput = Pick<CartItem, 'productId' | 'quantity' | 'selection'>

export interface CreateOrderInput {
  idempotencyKey: string
  items: OrderLineInput[]
  postcode: string
  paymentMethod: PaymentMethod
  delivery: Omit<DeliveryDetails, 'postcode' | 'timing'>
}

export interface OrderQuote {
  subtotal: Pence
  deliveryFee: Pence
  total: Pence
}

export interface PlacedOrder {
  order: { id: string; number: string; status: OrderStatus; etaMinutes: number; total: Pence }
  trackingKey: string
  clientSecret?: string
}

export interface TrackedOrder {
  id: string
  number: string
  status: OrderStatus
  etaMinutes: number
}

export interface Order {
  id: string
  number: string
  status: OrderStatus
  trackingKey: string
  etaLabel: string
}
