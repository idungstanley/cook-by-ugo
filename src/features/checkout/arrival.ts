import type { OrderSummary } from '@/types'

/** The kitchen's clock, whatever time zone the customer's phone is set to. */
const SHOP_TIME_ZONE = 'Europe/London'

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: SHOP_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})
const dayFormat = new Intl.DateTimeFormat('en-GB', { timeZone: SHOP_TIME_ZONE, dateStyle: 'short' })
const weekdayFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: SHOP_TIME_ZONE,
  weekday: 'long',
})

/** "Today, 12:00pm": the chosen slot for scheduled orders, otherwise order time plus the wait. */
export const arrivalLabel = (
  order: Pick<OrderSummary, 'createdAt' | 'etaMinutes' | 'scheduledFor'>,
) => {
  const at = new Date(order.scheduledFor ?? order.createdAt + order.etaMinutes * 60_000)
  const day =
    dayFormat.format(at) === dayFormat.format(new Date()) ? 'Today' : weekdayFormat.format(at)
  return `${day}, ${timeFormat.format(at).replace(' ', '')}`
}
