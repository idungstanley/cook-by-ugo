export interface OpeningHours {
  label: string
  /** Days use `Date.getDay()` numbering, so Sunday is 0. */
  days: number[]
  opensAtHour: number
  closesAtHour: number
  hoursLabel: string
}

export interface SiteInfo {
  phone: string
  phoneHref: string
  email: string
  whatsappNumber: string
  areaLabel: string
  directionsUrl: string
  deliveryWindow: string
  hours: OpeningHours[]
}
