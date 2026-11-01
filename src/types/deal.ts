import type { Pence } from './menu'

export type DealTheme = 'jollof' | 'ewedu' | 'indigo'

export interface Deal {
  id: string
  name: string
  tag: string
  description: string
  price: Pence
  wasPrice: Pence
  image: string
  theme: DealTheme
}
