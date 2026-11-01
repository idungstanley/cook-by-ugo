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
}

describe('delivery schema', () => {
  it('accepts a Newcastle order', () => {
    expect(deliverySchema.safeParse(delivery).success).toBe(true)
  })

  it('rejects valid postcodes outside the delivery area', () => {
    const result = deliverySchema.safeParse({ ...delivery, postcode: 'SW1A 1AA' })
    expect(result.error?.issues[0]?.message).toContain('NE postcodes')
  })

  it('requires a slot for scheduled orders', () => {
    const result = deliverySchema.safeParse({ ...delivery, timing: 'scheduled' })
    expect(result.error?.issues[0]?.path).toEqual(['scheduledSlot'])
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
