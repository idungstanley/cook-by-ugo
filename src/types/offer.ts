import type { Pence } from './menu'

export type OfferType = 'bogo' | 'percent' | 'amount' | 'free-delivery'

export interface Offer {
  id: string
  name: string
  type: OfferType
  label: string
  /** Dishes the offer covers. Empty means the whole order. */
  dishIds: string[]
  minSubtotal: Pence
  endsAt?: number
}

export interface AppliedOffer {
  offerId: string
  name: string
  discount: Pence
  freeDelivery: boolean
}
