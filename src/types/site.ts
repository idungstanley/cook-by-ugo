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
  freeDeliveryThreshold: number
  cardEnabled: boolean
  payOnDeliveryEnabled: boolean
}

export interface DeliverySlot {
  at: number
  label: string
}
