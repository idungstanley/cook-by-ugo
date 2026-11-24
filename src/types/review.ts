export interface Review {
  id: string
  displayName: string
  rating: number
  comment?: string
  likedItems: string[]
  reply?: string
  /** Where it was left, such as "Uber Eats". Missing for reviews left on this website. */
  source?: string
  createdAt: number
}

export interface ReviewSummary {
  average: number
  count: number
  breakdown: { stars: number; count: number }[]
}

export interface ReviewInput {
  rating: number
  comment?: string
  likedItems: string[]
}
