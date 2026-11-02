import { queryOptions, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { siteApi } from './site.api'

const SITE_STALE_MS = 60_000

export const siteInfoQuery = queryOptions({
  queryKey: queryKeys.siteInfo,
  queryFn: siteApi.getSiteInfo,
  staleTime: SITE_STALE_MS,
})

export const useSiteInfo = () => useQuery(siteInfoQuery)

export const useDeliverySlots = () =>
  useQuery({ queryKey: queryKeys.slots, queryFn: siteApi.getSlots, staleTime: SITE_STALE_MS })
