import { describe, expect, it } from 'vitest'
import { addCartItem, calculateCartTotals, updateCartItemQuantity } from './cart.utils'
import type { NewCartItem } from '@/types'

const chapman: NewCartItem = { productId: 'chapman', name: 'Chapman', image: '', unitPrice: 349 }
const jollof: NewCartItem = {
  productId: 'party-jollof-rice',
  name: 'Party Jollof Rice',
  image: '',
  unitPrice: 1299,
  optionKey: 'protein=vegetarian',
}

describe('cart utils', () => {
  it('merges identical lines and keeps different options apart', () => {
    let items = addCartItem([], jollof)
    items = addCartItem(items, jollof)
    items = addCartItem(items, { ...jollof, optionKey: 'protein=beef' })

    expect(items).toHaveLength(2)
    expect(items[0]?.quantity).toBe(2)
  })

  it('removes a line when its quantity drops below one', () => {
    const items = addCartItem([], chapman)
    expect(updateCartItemQuantity(items, 'chapman', 0)).toEqual([])
  })

  it('matches the design example, with free delivery over the threshold', () => {
    const items = [
      ...addCartItem([], { ...chapman, quantity: 2 }),
      ...addCartItem([], { ...jollof, quantity: 2 }),
    ]
    expect(calculateCartTotals(items)).toMatchObject({
      itemCount: 4,
      subtotal: 3296,
      deliveryFee: 0,
      total: 3296,
    })
  })

  it('charges delivery below the threshold, and nothing on an empty cart', () => {
    expect(calculateCartTotals(addCartItem([], chapman)).deliveryFee).toBeGreaterThan(0)
    expect(calculateCartTotals([]).deliveryFee).toBe(0)
  })
})
