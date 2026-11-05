import { loadStripe, type Stripe } from '@stripe/stripe-js'

const loaded = new Map<string, Promise<Stripe | null>>()

/** Stripe's script loads once, and only when a customer reaches payment. */
export const getStripe = (publishableKey: string) => {
  const existing = loaded.get(publishableKey)
  if (existing) return existing
  const stripe = loadStripe(publishableKey)
  loaded.set(publishableKey, stripe)
  return stripe
}
