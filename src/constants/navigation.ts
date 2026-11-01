export const HEADER_NAV = [
  { label: 'Menu', to: '/menu' },
  { label: 'Deals', to: '/', hash: 'deals' },
  { label: 'Our story', to: '/', hash: 'our-story' },
  { label: 'Find us', to: '/', hash: 'find-us' },
] as const

export const FOOTER_NAV = [
  {
    title: 'Order',
    links: [
      { label: 'Menu', to: '/menu' },
      { label: 'Deals', to: '/', hash: 'deals' },
      { label: 'Catering', to: '/info/$slug', slug: 'catering' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', to: '/', hash: 'our-story' },
      { label: 'Find us', to: '/', hash: 'find-us' },
      { label: 'Contact', to: '/info/$slug', slug: 'contact' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Delivery areas', to: '/info/$slug', slug: 'delivery-areas' },
      { label: 'Allergens', to: '/info/$slug', slug: 'allergens' },
      { label: 'Privacy', to: '/info/$slug', slug: 'privacy' },
    ],
  },
] as const

export const INFO_PAGES: Record<string, string> = {
  'our-story': 'Our story',
  catering: 'Catering',
  contact: 'Contact',
  'delivery-areas': 'Delivery areas',
  allergens: 'Allergens',
  privacy: 'Privacy',
}
