import { describe, expect, it } from 'vitest'
import { cardSchema, deliverySchema } from './checkout.schema'

const delivery = {
  fullName: 'Test Customer',
  email: 'test@example.com',
  phone: '07700 900123',
  address: '1 Test Street',
  city: 'Newcastle upon Tyne',
  postcode: 'NE1 4ST',
  timing: 'asap',
  marketingOptIn: false,
}

describe('delivery schema', () => {
  it('accepts a Newcastle order', () => {
    expect(deliverySchema.safeParse(delivery).success).toBe(true)
  })

  it('requires a slot for scheduled orders', () => {
    const result = deliverySchema.safeParse({ ...delivery, timing: 'scheduled' })
    expect(result.error?.issues[0]?.path).toEqual(['scheduledFor'])
  })
})

describe('card schema', () => {
  const card = {
    cardNumber: '4242 4242 4242 4242',
    expiry: '12 / 30',
    cvc: '123',
    nameOnCard: 'Test Customer',
  }

  it('accepts spaced card numbers', () => {
    expect(cardSchema.safeParse(card).success).toBe(true)
  })

  it('rejects invalid expiry dates', () => {
    expect(cardSchema.safeParse({ ...card, expiry: '13 / 30' }).success).toBe(false)
  })
})
