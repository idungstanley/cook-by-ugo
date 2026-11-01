import { queryOptions, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import { menuApi } from './menu.api'

export const categoriesQuery = queryOptions({
  queryKey: queryKeys.categories,
  queryFn: menuApi.getCategories,
})

export const dishesQuery = queryOptions({
  queryKey: queryKeys.dishes,
  queryFn: menuApi.getDishes,
})

export const optionGroupsQuery = queryOptions({
  queryKey: queryKeys.optionGroups,
  queryFn: menuApi.getOptionGroups,
})

export const favouritesQuery = queryOptions({
  queryKey: queryKeys.favourites,
  queryFn: menuApi.getFavourites,
})

export const useCategories = () => useQuery(categoriesQuery)
export const useDishes = () => useQuery(dishesQuery)
export const useOptionGroups = () => useQuery(optionGroupsQuery)
export const useFavourites = () => useQuery(favouritesQuery)
