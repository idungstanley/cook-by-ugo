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
      { label: 'Your account', to: '/account' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', to: '/', hash: 'our-story' },
      { label: 'Find us', to: '/', hash: 'find-us' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Allergens', to: '/allergens' },
      { label: 'Privacy', to: '/privacy' },
    ],
  },
] as const
