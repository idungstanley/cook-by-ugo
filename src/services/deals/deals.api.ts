import { deals } from '@/mocks/deals'
import { mockRequest } from '@/services/mockClient'

export const dealsApi = {
  getDeals: () => mockRequest(deals),
}
