import { describe, expect, it } from 'vitest'
import { deliverySchema } from './checkout.schema'

const delivery = {
  fullName: 'Test Customer',
  email: 'test@example.com',
  phoneCountry: 'GB',
  phoneNumber: '07400 123456',
  address: '1 Test Street',
  city: 'Newcastle upon Tyne',
  postcode: 'NE1 4ST',
  postcodeConfirmed: true,
  timing: 'asap',
  marketingOptIn: false,
}

describe('delivery schema', () => {
  it('accepts a Newcastle order and stores the phone in international format', () => {
    const result = deliverySchema.safeParse(delivery)
    expect(result.data?.phone).toBe('+44 7400 123456')
  })

  it('accepts numbers from other countries', () => {
    const result = deliverySchema.safeParse({
      ...delivery,
      phoneCountry: 'NG',
      phoneNumber: '0803 123 4567',
    })
    expect(result.data?.phone).toBe('+234 803 123 4567')
  })

  it('rejects a number that is not real for the chosen country', () => {
    const result = deliverySchema.safeParse({ ...delivery, phoneNumber: '123' })
    expect(result.error?.issues[0]?.path).toEqual(['phoneNumber'])
  })

  it('requires the postcode to be checked first', () => {
    const result = deliverySchema.safeParse({ ...delivery, postcodeConfirmed: false })
    expect(result.error?.issues[0]?.path).toEqual(['postcode'])
  })

  it('requires a slot for scheduled orders', () => {
    const result = deliverySchema.safeParse({ ...delivery, timing: 'scheduled' })
    expect(result.error?.issues[0]?.path).toEqual(['scheduledFor'])
  })
})
