import { describe, expect, it } from 'vitest'
import {
  addCartItem,
  calculateCartTotals,
  refreshCartItems,
  updateCartItemQuantity,
} from './cart.utils'
import type { Dish, NewCartItem, OptionGroup } from '@/types'

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

  it('refreshes saved prices from the current menu, and leaves unknown lines alone', () => {
    const sides: OptionGroup = {
      id: 'sides',
      title: 'Add a side',
      kind: 'chips',
      required: false,
      maxChoices: 2,
      choices: [{ id: 'dodo', label: 'Fried Plantain', priceDelta: 200 }],
    }
    const dish = {
      id: 'party-jollof-rice',
      name: 'Party Jollof Rice',
      image: 'jollof.jpg',
      price: 1399,
      optionGroupIds: ['sides'],
    } as Dish
    const saved = addCartItem([], {
      ...jollof,
      unitPrice: 1449,
      basePrice: 1299,
      selection: { sides: ['dodo'] },
    })
    const unknown = addCartItem([], { ...chapman, productId: 'retired-dish' })

    const [line] = refreshCartItems(saved, [dish], [sides], [])
    expect(line).toMatchObject({ basePrice: 1399, unitPrice: 1599, image: 'jollof.jpg' })
    expect(line?.options).toEqual([
      { groupTitle: 'Add a side', label: 'Fried Plantain', price: 200 },
    ])
    expect(refreshCartItems(unknown, [dish], [sides], [])).toBe(unknown)
  })
})
