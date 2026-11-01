import { categories, dishes, favourites, optionGroups } from '@/mocks/menu'
import { mockRequest } from '@/services/mockClient'

export const menuApi = {
  getCategories: () => mockRequest(categories),
  getDishes: () => mockRequest(dishes),
  getOptionGroups: () => mockRequest(optionGroups),
  getFavourites: () => mockRequest(favourites),
}
