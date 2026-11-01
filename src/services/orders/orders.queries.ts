import { useMutation, useQuery } from '@tanstack/react-query'
import { ORDER_STATUS_POLL_MS } from '@/constants/checkout'
import { queryKeys } from '@/constants/queryKeys'
import { ordersApi } from './orders.api'

export const useCreateOrder = () => useMutation({ mutationFn: ordersApi.createOrder })

export const useOrder = (orderId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.order(orderId ?? ''),
    queryFn: () => ordersApi.getOrder(orderId ?? ''),
    enabled: Boolean(orderId),
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data?.status === 'delivered' ? false : ORDER_STATUS_POLL_MS,
  })
