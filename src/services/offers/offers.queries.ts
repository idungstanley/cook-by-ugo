import { queryOptions, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { offersApi } from './offers.api'

export const offersQuery = queryOptions({
  queryKey: queryKeys.offers,
  queryFn: offersApi.getOffers,
  staleTime: 60_000,
})

export const useOffers = () => useQuery(offersQuery)

/** The live offer on a dish, if any, for the badge on its card. */
export const useDishOffer = (dishId: string) => {
  const { data: offers } = useOffers()
  return offers?.find(({ dishIds, type }) => type !== 'free-delivery' && dishIds.includes(dishId))
}
