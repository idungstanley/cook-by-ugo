import { http } from '@/lib/http'
import type { Review, ReviewInput, ReviewSummary } from '@/types'

export const reviewsApi = {
  getReviews: () => http.get<{ summary: ReviewSummary; reviews: Review[] }>('/reviews'),
  submitReview: ({
    orderId,
    trackingKey,
    input,
  }: {
    orderId: string
    trackingKey: string
    input: ReviewInput
  }) =>
    http.post<{ rating: number }>(
      `/orders/${orderId}/review?key=${encodeURIComponent(trackingKey)}`,
      input,
    ),
}
