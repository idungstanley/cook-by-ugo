export const TICKER_ITEMS = [
  'Party Jollof',
  'Suya Night',
  'Pounded Yam & Egusi',
  'Fried Dodo',
  'Pepper Soup',
  'Moi Moi',
] as const

export const HERO_STATS = [
  { value: '35–45 min', label: 'delivery' },
  { value: 'Cooked', label: 'fresh daily' },
  { value: '100%', label: 'halal meat' },
] as const

export const STORY_STATS = [
  { value: '100%', label: 'Authentic recipes' },
  { value: 'Fresh', label: 'Cooked every day' },
  { value: 'Halal', label: 'Certified meat' },
] as const

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Pick your dish',
    body: 'Choose a protein and up to two sides. Prices update as you go.',
    tone: 'bg-jollof',
  },
  {
    title: 'Choose a time',
    body: 'ASAP in 35 to 45 minutes, or schedule it for later.',
    tone: 'bg-ewedu',
  },
  {
    title: 'Pay your way',
    body: 'Card online, or cash and card when it arrives.',
    tone: 'bg-indigo',
  },
] as const
