import { http } from '@/lib/http'
import type { DeliverySlot, PostcodeCheck, SiteInfo } from '@/types'

export const siteApi = {
  getSiteInfo: () => http.get<SiteInfo>('/site'),
  getSlots: () => http.get<DeliverySlot[]>('/slots'),
  checkPostcode: (postcode: string) =>
    http.get<PostcodeCheck>(`/postcodes/${encodeURIComponent(postcode.trim())}`),
}
