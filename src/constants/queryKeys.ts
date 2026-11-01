export const queryKeys = {
  categories: ['menu', 'categories'] as const,
  dishes: ['menu', 'dishes'] as const,
  optionGroups: ['menu', 'option-groups'] as const,
  favourites: ['menu', 'favourites'] as const,
  deals: ['deals'] as const,
  siteInfo: ['site-info'] as const,
  order: (orderId: string) => ['orders', orderId] as const,
}
