import { describe, expect, it } from 'vitest'
import {
  getFirstMissingGroup,
  getInitialSelection,
  getSelectionSummary,
  getUnitPrice,
  toggleChoice,
} from './dishSelection'
import { optionGroups } from './dishSelection.fixtures'

const [protein, sides, spice] = optionGroups as [
  (typeof optionGroups)[number],
  (typeof optionGroups)[number],
  (typeof optionGroups)[number],
]

describe('dish selection', () => {
  it('blocks adding until the required protein is chosen', () => {
    const selection = getInitialSelection(optionGroups)
    expect(getFirstMissingGroup(optionGroups, selection)?.id).toBe('protein')
    const chosen = toggleChoice(selection, protein, 'vegetarian')
    expect(getFirstMissingGroup(optionGroups, chosen)).toBeUndefined()
  })

  it('matches the design price of £14.49 with fried plantain', () => {
    let selection = toggleChoice(getInitialSelection(optionGroups), protein, 'vegetarian')
    selection = toggleChoice(selection, sides, 'fried-plantain')
    selection = toggleChoice(selection, spice, 'naija-hot')

    expect(getUnitPrice(1299, optionGroups, selection)).toBe(1449)
    expect(getSelectionSummary(optionGroups, selection)).toBe(
      'Vegetarian · Fried Plantain · Naija hot',
    )
  })

  it('caps sides at two', () => {
    let selection = getInitialSelection(optionGroups)
    for (const choice of ['fried-plantain', 'moi-moi', 'coleslaw']) {
      selection = toggleChoice(selection, sides, choice)
    }
    expect(selection.sides).toEqual(['fried-plantain', 'moi-moi'])
  })
})
