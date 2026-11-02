import { http } from '@/lib/http'
import type { Deal } from '@/types'

export const dealsApi = {
  getDeals: () => http.get<Deal[]>('/deals'),
}
