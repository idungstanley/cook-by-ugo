import { queryOptions, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { dealsApi } from './deals.api'

export const dealsQuery = queryOptions({
  queryKey: queryKeys.deals,
  queryFn: dealsApi.getDeals,
})

export const useDeals = () => useQuery(dealsQuery)
