import { http } from '@/lib/http'
import type { Category, Dish, FavouriteDish, OptionGroup } from '@/types'

export const menuApi = {
  getCategories: () => http.get<Category[]>('/categories'),
  getDishes: () => http.get<Dish[]>('/dishes'),
  getOptionGroups: () => http.get<OptionGroup[]>('/option-groups'),
  getFavourites: () => http.get<FavouriteDish[]>('/favourites'),
}
