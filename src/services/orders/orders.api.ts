import { http } from '@/lib/http'
import type {
  ChangeResponse,
  CreateOrderInput,
  OrderLineInput,
  OrderQuote,
  PlacedOrder,
  TrackedOrder,
} from '@/types'

export const ordersApi = {
  getQuote: (input: { items: OrderLineInput[]; postcode?: string }) =>
    http.post<OrderQuote>('/quote', input),
  createOrder: (input: CreateOrderInput) => http.post<PlacedOrder>('/orders', input),
  respondToChanges: ({
    orderId,
    trackingKey,
    response,
  }: {
    orderId: string
    trackingKey: string
    response: ChangeResponse
  }) =>
    http.post<{ status: string; total: number; clientSecret?: string; extra?: number }>(
      `/orders/${orderId}/changes?key=${encodeURIComponent(trackingKey)}`,
      response,
    ),
  getOrder: (orderId: string, trackingKey: string) =>
    http.get<TrackedOrder>(`/orders/${orderId}?key=${encodeURIComponent(trackingKey)}`),
}
