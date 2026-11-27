export interface OpeningHours {
  label: string
  /** Days use `Date.getDay()` numbering, so Sunday is 0. */
  days: number[]
  hoursLabel: string
}

export interface SiteInfo {
  announcement: string
  heroHeadline: string
  heroText: string
  storyText: string
  phone: string
  phoneHref: string
  email: string
  whatsappNumber: string
  areaLabel: string
  directionsUrl: string
  deliveryWindow: string
  hours: OpeningHours[]
  isOpen: boolean
  ordersPaused: boolean
  todayHours: string
  /** Null when the shop has no free delivery over an amount. */
  freeDeliveryThreshold: number | null
  /** Customers sign in or create an account before they can order. */
  accountRequired?: boolean
  /** Minutes from order to door for an order placed now. */
  leadMinutes: number
  stripePublishableKey: string | null
  /** Whether checkout can list Royal Mail addresses for a postcode. */
  addressLookup: boolean
}

export interface AddressOption {
  id: string
  line1: string
  line2: string
  city: string
}

export interface PostcodeCheck {
  postcode: string
  city: string
  distanceMiles: number
  covered: boolean
  fee: number
  minimumOrder: number
  maxMiles: number
  addresses: AddressOption[]
}

/** Royal Mail addresses for a postcode, wherever it is. */
export interface AddressLookup {
  postcode: string
  city: string
  addresses: AddressOption[]
}

/** A time for a scheduled order. `at` is when the kitchen starts; the food arrives later. */
export interface DeliverySlot {
  at: number
  label: string
  arrivesAt?: number
  arrivalLabel?: string
}
