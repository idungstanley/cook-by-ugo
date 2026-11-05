import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { reviewsApi } from './reviews.api'

export const reviewsQuery = queryOptions({
  queryKey: queryKeys.reviews,
  queryFn: reviewsApi.getReviews,
  staleTime: 5 * 60_000,
})

export const useReviews = () => useQuery(reviewsQuery)

export const useSubmitReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewsApi.submitReview,
    onSuccess: (_review, { orderId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.order(orderId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.accountOrders })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reviews })
    },
  })
}
