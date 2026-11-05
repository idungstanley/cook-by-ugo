import { createFileRoute } from '@tanstack/react-router'
import { TrackOrderPage } from '@/features/orders/TrackOrderPage'

interface TrackSearch {
  key: string
  redirect_status?: string
}

const TrackRoute = () => {
  const { orderId } = Route.useParams()
  const { key, redirect_status } = Route.useSearch()
  return (
    <TrackOrderPage
      orderId={orderId}
      trackingKey={key}
      paymentReturned={redirect_status === 'succeeded'}
    />
  )
}

export const Route = createFileRoute('/track/$orderId')({
  validateSearch: (search: Record<string, unknown>): TrackSearch => ({
    key: typeof search.key === 'string' ? search.key : '',
    redirect_status:
      typeof search.redirect_status === 'string' ? search.redirect_status : undefined,
  }),
  head: () => ({ meta: [{ title: 'Your order · Cooked by Ugo' }] }),
  component: TrackRoute,
})
