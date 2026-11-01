import { ASAP_LABEL } from '@/constants/checkout'
import { mockRequest } from '@/services/mockClient'
import type { CreateOrderInput, Order, OrderStatus } from '@/types'

const MOCK_SUBMIT_LATENCY_MS = 900
/** Moves the mock order to its next stage on this interval, so the tracker can be demoed. */
const MOCK_STAGE_MS = 20_000
const MOCK_STATUS_FLOW: OrderStatus[] = ['received', 'preparing', 'out-for-delivery', 'delivered']

const orders = new Map<string, Order>()

const generateOrderNumber = () => `UGO-${Math.floor(1000 + Math.random() * 9000)}`

const statusFor = ({ createdAt }: Order): OrderStatus => {
  const stage = Math.floor((Date.now() - createdAt) / MOCK_STAGE_MS)
  return MOCK_STATUS_FLOW[Math.min(stage, MOCK_STATUS_FLOW.length - 1)] ?? 'received'
}

export const ordersApi = {
  createOrder: (input: CreateOrderInput) => {
    const order: Order = {
      ...input,
      id: crypto.randomUUID(),
      number: generateOrderNumber(),
      status: 'received',
      etaLabel:
        input.delivery.timing === 'scheduled' && input.delivery.scheduledSlot
          ? input.delivery.scheduledSlot
          : ASAP_LABEL,
      createdAt: Date.now(),
    }
    orders.set(order.id, order)
    return mockRequest(order, MOCK_SUBMIT_LATENCY_MS)
  },

  getOrder: (orderId: string) => {
    const order = orders.get(orderId)
    if (!order) return Promise.reject(new Error('Order not found'))
    return mockRequest({ ...order, status: statusFor(order) })
  },
}
