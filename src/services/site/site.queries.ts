import { queryOptions, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { siteApi } from './site.api'

export const siteInfoQuery = queryOptions({
  queryKey: queryKeys.siteInfo,
  queryFn: siteApi.getSiteInfo,
})

export const useSiteInfo = () => useQuery(siteInfoQuery)
