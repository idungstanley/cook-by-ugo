import { http } from '@/lib/http'
import type {
  CreateOrderInput,
  OrderLineInput,
  OrderQuote,
  PlacedOrder,
  TrackedOrder,
} from '@/types'

export const ordersApi = {
  getQuote: (input: { items: OrderLineInput[]; postcode: string }) =>
    http.post<OrderQuote>('/quote', input),
  createOrder: (input: CreateOrderInput) => http.post<PlacedOrder>('/orders', input),
  getOrder: (orderId: string, trackingKey: string) =>
    http.get<TrackedOrder>(`/orders/${orderId}?key=${encodeURIComponent(trackingKey)}`),
}
