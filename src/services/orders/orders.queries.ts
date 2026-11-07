import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ORDER_STATUS_POLL_MS } from '@/constants/checkout'
import { queryKeys } from '@/constants/queryKeys'
import type { OrderLineInput, OrderStatus } from '@/types'
import { ordersApi } from './orders.api'

const FINISHED_STATUSES: OrderStatus[] = ['delivered', 'cancelled']

export const useCreateOrder = () => useMutation({ mutationFn: ordersApi.createOrder })

/**
 * The server's price for this basket, which is what the customer pays. Without a postcode it
 * still includes any offer, just not delivery.
 */
export const useOrderQuote = (items: OrderLineInput[], postcode?: string) =>
  useQuery({
    queryKey: queryKeys.quote(items, postcode),
    queryFn: () => ordersApi.getQuote({ items, postcode: postcode || undefined }),
    enabled: items.length > 0,
    retry: false,
    staleTime: 0,
    placeholderData: (previous) => previous,
  })

export const useOrder = (orderId: string, trackingKey: string) =>
  useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => ordersApi.getOrder(orderId, trackingKey),
    staleTime: 0,
    refetchInterval: (query) =>
      FINISHED_STATUSES.includes(query.state.data?.status as OrderStatus)
        ? false
        : ORDER_STATUS_POLL_MS,
  })

export const useRespondToChanges = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ordersApi.respondToChanges,
    onSuccess: (_result, { orderId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.order(orderId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.accountOrders })
    },
  })
}
