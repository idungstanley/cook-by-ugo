import type { CartItem, CartItemOption } from './cart'
import type { Pence } from './menu'
import type { AppliedOffer } from './offer'

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

export type OrderLineInput = Pick<CartItem, 'productId' | 'quantity' | 'selection' | 'note'>

export interface CreateOrderInput {
  idempotencyKey: string
  items: OrderLineInput[]
  postcode: string
  delivery: Omit<DeliveryDetails, 'postcode' | 'timing'>
}

export interface OrderQuote {
  subtotal: Pence
  discount: Pence
  appliedOffers: AppliedOffer[]
  deliveryFee: Pence
  total: Pence
}

export interface OrderLine {
  id: string
  productId: string
  name: string
  basePrice?: Pence
  options?: CartItemOption[]
  note?: string
  summary?: string
  quantity: number
  unitPrice: Pence
}

export interface OrderSummary {
  id: string
  number: string
  status: OrderStatus
  etaMinutes: number
  createdAt: number
  scheduledFor?: number
  items: OrderLine[]
  subtotal: Pence
  discount: Pence
  deliveryFee: Pence
  total: Pence
}

export interface PlacedOrder {
  order: OrderSummary
  trackingKey: string
  /** Present when Stripe's payment form is needed to finish the order. */
  clientSecret?: string
}

export interface TrackedOrder extends OrderSummary {
  paymentStatus: string
  review: { rating: number; comment?: string; reply?: string } | null
}

/** What the confirmation screen needs after checkout. */
export interface Order {
  id: string
  number: string
  status: OrderStatus
  trackingKey: string
  etaLabel: string
}
