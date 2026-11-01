import { useMemo, useState } from 'react'
import {
  getFirstMissingGroup,
  getInitialSelection,
  getSelectionKey,
  getSelectionSummary,
  getUnitPrice,
  toggleChoice,
} from '@/features/menu/dishSelection'
import type { Dish, OptionGroup } from '@/types'

export const useDishSelection = (dish: Dish, groups: OptionGroup[]) => {
  const [selection, setSelection] = useState(() => getInitialSelection(groups))
  const [quantity, setQuantity] = useState(1)

  const unitPrice = useMemo(
    () => getUnitPrice(dish.price, groups, selection),
    [dish.price, groups, selection],
  )

  return {
    selection,
    quantity,
    setQuantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    missingGroup: getFirstMissingGroup(groups, selection),
    summary: getSelectionSummary(groups, selection),
    optionKey: getSelectionKey(selection),
    toggle: (group: OptionGroup, choiceId: string) =>
      setSelection((current) => toggleChoice(current, group, choiceId)),
  }
}
