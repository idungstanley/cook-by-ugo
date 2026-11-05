import { useMemo, useState } from 'react'
import {
  getFirstMissingGroup,
  getInitialSelection,
  getSelectedOptions,
  getSelectionKey,
  getSelectionSummary,
  getUnitPrice,
  toggleChoice,
} from '@/features/menu/dishSelection'
import type { Dish, OptionGroup } from '@/types'

export const useDishSelection = (dish: Dish, groups: OptionGroup[]) => {
  const [selection, setSelection] = useState(() => getInitialSelection(groups))
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')

  const unitPrice = useMemo(
    () => getUnitPrice(dish.price, groups, selection),
    [dish.price, groups, selection],
  )
  const trimmedNote = note.trim()

  return {
    selection,
    quantity,
    setQuantity,
    note,
    setNote,
    unitPrice,
    totalPrice: unitPrice * quantity,
    missingGroup: getFirstMissingGroup(groups, selection),
    options: getSelectedOptions(groups, selection),
    summary: getSelectionSummary(groups, selection),
    // Two of the same dish with different notes stay as separate lines in the basket.
    optionKey: [getSelectionKey(selection), trimmedNote && `note=${trimmedNote}`]
      .filter(Boolean)
      .join('|'),
    toggle: (group: OptionGroup, choiceId: string) => {
      const next = toggleChoice(selection, group, choiceId)
      setSelection(next)
      return next
    },
  }
}
