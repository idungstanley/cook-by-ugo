import { http } from '@/lib/http'
import type { DeliverySlot, SiteInfo } from '@/types'

export const siteApi = {
  getSiteInfo: () => http.get<SiteInfo>('/site'),
  getSlots: () => http.get<DeliverySlot[]>('/slots'),
}
