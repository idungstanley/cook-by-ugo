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
  | 'pending-payment'
  | 'received'
  | 'awaiting-customer'
  | 'preparing'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

/** The kitchen ran out of something, and the customer chooses what happens. */
export interface OrderAmendment {
  state: 'waiting' | 'awaiting-payment' | 'resolved'
  unavailableItemIds: string[]
  message?: string
  resolution?: 'removed' | 'replaced' | 'cancelled'
  /** A started payment for replacements that cost more. */
  topUp: { extra: Pence; clientSecret?: string } | null
  /** Exactly what removing the items gives back, with offers re-checked. */
  removalRefund: Pence | null
}

export type ChangeResponse =
  { action: 'remove' } | { action: 'cancel' } | { action: 'replace'; items: OrderLineInput[] }

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
  amendment: OrderAmendment | null
}

/** What the confirmation screen needs after checkout. */
export interface Order {
  id: string
  number: string
  status: OrderStatus
  trackingKey: string
  etaLabel: string
}
