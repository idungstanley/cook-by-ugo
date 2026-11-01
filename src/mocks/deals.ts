import type { Deal } from '@/types'

export const deals: Deal[] = [
  {
    id: 'naija-family-box',
    name: 'Naija Family Box',
    tag: 'Feeds 4',
    description:
      'Large jollof, large fried rice, 4 pieces of peppered chicken, 2 dodo and 4 drinks.',
    price: 4499,
    wasPrice: 6094,
    image: '/images/deals/naija-family-box.jpg',
    theme: 'jollof',
  },
  {
    id: 'suya-night',
    name: 'Suya Night',
    tag: 'Fridays only',
    description: 'Suya platter for 2, large jollof and 2 cold Zobos. Every Friday.',
    price: 2799,
    wasPrice: 3846,
    image: '/images/deals/suya-night.jpg',
    theme: 'ewedu',
  },
  {
    id: 'solo-meal-deal',
    name: 'Solo Meal Deal',
    tag: 'Just for you',
    description: 'Any main rice or swallow, one side and a drink of your choice.',
    price: 1499,
    wasPrice: 1997,
    image: '/images/deals/solo-meal-deal.jpg',
    theme: 'indigo',
  },
]
