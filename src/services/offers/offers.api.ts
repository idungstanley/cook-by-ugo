import { http } from '@/lib/http'
import type { Offer } from '@/types'

export const offersApi = {
  getOffers: () => http.get<Offer[]>('/offers'),
}
