import type { OrderStatus } from '@/types'

/** Basket estimates only. Real fees come from the delivery zones on the server. */
export const FREE_DELIVERY_THRESHOLD = 2500
export const DELIVERY_FEE = 299
export const DEFAULT_CITY = 'Newcastle upon Tyne'

export const UPSELL_DISH_ID = 'fried-plantain'

export const CHECKOUT_STEPS = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'done', label: 'Done' },
] as const

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]['id']

export const ORDER_STAGES: { status: OrderStatus; title: string; body: string }[] = [
  { status: 'received', title: 'Order received', body: 'We have got your order' },
  { status: 'preparing', title: 'Being prepared', body: 'Ugo is cooking your food now' },
  { status: 'out-for-delivery', title: 'Out for delivery', body: 'Your rider is on the way' },
  { status: 'delivered', title: 'Delivered', body: 'Enjoy your meal' },
]

export const ORDER_STATUS_POLL_MS = 5000
