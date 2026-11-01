import type { OrderStatus } from '@/types'

/** Mock values until the delivery fee and zones are agreed with the client. */
export const FREE_DELIVERY_THRESHOLD = 2500
export const DELIVERY_FEE = 299
export const DELIVERY_POSTCODE_PREFIX = 'NE'
export const DEFAULT_CITY = 'Newcastle upon Tyne'
export const ASAP_LABEL = '35 to 45 min'

export const UPSELL_DISH_ID = 'fried-plantain'

export const CHECKOUT_STEPS = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'done', label: 'Done' },
] as const

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]['id']

export const SCHEDULED_SLOTS = [
  'Today, 6:00pm',
  'Today, 6:30pm',
  'Today, 7:00pm',
  'Today, 7:30pm',
  'Today, 8:00pm',
] as const

export const ORDER_STAGES: { status: OrderStatus; title: string; body: string }[] = [
  { status: 'received', title: 'Order received', body: 'We have got your order' },
  { status: 'preparing', title: 'Being prepared', body: 'Ugo is cooking your food now' },
  { status: 'out-for-delivery', title: 'Out for delivery', body: 'Your rider is on the way' },
  { status: 'delivered', title: 'Delivered', body: 'Enjoy your meal' },
]

export const ORDER_STATUS_POLL_MS = 5000
