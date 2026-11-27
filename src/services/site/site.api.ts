import { http } from '@/lib/http'
import type { AddressLookup, DeliverySlot, PostcodeCheck, SiteInfo } from '@/types'

export const siteApi = {
  getSiteInfo: () => http.get<SiteInfo>('/site'),
  getSlots: () => http.get<DeliverySlot[]>('/slots'),
  checkPostcode: (postcode: string) =>
    http.get<PostcodeCheck>(`/postcodes/${encodeURIComponent(postcode.trim())}`),
  searchAddresses: (query: string, session: string) =>
    http.get<{ id: string; text: string; secondary: string }[]>(
      `/places/search?q=${encodeURIComponent(query)}&session=${encodeURIComponent(session)}`,
    ),
  getPlaceAddress: (placeId: string, session: string) =>
    http.get<{ line1: string; city: string; postcode: string }>(
      `/places/${encodeURIComponent(placeId)}?session=${encodeURIComponent(session)}`,
    ),
  findAddresses: (postcode: string) =>
    http.get<AddressLookup>(`/addresses/${encodeURIComponent(postcode.trim())}`),
}
