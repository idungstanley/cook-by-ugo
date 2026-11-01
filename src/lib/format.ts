import type { Pence } from '@/types'

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

export const formatPrice = (amount: Pence) => currency.format(amount / 100)

export const formatPriceDelta = (amount: Pence) => `+${formatPrice(amount)}`

export const pluralise = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`
