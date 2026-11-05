import type { OrderSummary } from './order'

export interface SavedAddress {
  line1: string
  line2?: string
  city: string
  postcode: string
}

export interface Account {
  id: string
  name: string
  email: string
  phone?: string
  address?: SavedAddress
  marketingOptIn: boolean
}

export interface AccountSession {
  account: Account
  token: string
}

export interface AccountOrder extends OrderSummary {
  trackingKey: string
  reviewed: boolean
}
