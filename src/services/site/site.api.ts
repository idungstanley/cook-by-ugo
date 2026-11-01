import { siteInfo } from '@/mocks/site'
import { mockRequest } from '@/services/mockClient'

export const siteApi = {
  getSiteInfo: () => mockRequest(siteInfo),
}
