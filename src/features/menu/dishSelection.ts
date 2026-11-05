import type { CartItemOption, OptionGroup, Pence } from '@/types'

/** Selected choice ids, keyed by option group id. */
export type DishSelection = Record<string, string[]>

export const getInitialSelection = (groups: OptionGroup[]): DishSelection =>
  Object.fromEntries(
    groups.map(({ id, defaultChoiceId }) => [id, defaultChoiceId ? [defaultChoiceId] : []]),
  )

export const toggleChoice = (
  selection: DishSelection,
  group: OptionGroup,
  choiceId: string,
): DishSelection => {
  const current = selection[group.id] ?? []

  if (group.maxChoices === 1) return { ...selection, [group.id]: [choiceId] }
  if (current.includes(choiceId)) {
    return { ...selection, [group.id]: current.filter((id) => id !== choiceId) }
  }
  if (current.length >= group.maxChoices) return selection
  return { ...selection, [group.id]: [...current, choiceId] }
}

const selectedChoices = (group: OptionGroup, selection: DishSelection) =>
  group.choices.filter(({ id }) => selection[group.id]?.includes(id))

export const getUnitPrice = (basePrice: Pence, groups: OptionGroup[], selection: DishSelection) =>
  groups
    .flatMap((group) => selectedChoices(group, selection))
    .reduce((total, { priceDelta }) => total + priceDelta, basePrice)

export const getFirstMissingGroup = (groups: OptionGroup[], selection: DishSelection) =>
  groups.find(({ id, required }) => required && !selection[id]?.length)

export const getSelectionSummary = (groups: OptionGroup[], selection: DishSelection) =>
  groups
    .flatMap((group) => selectedChoices(group, selection))
    .map(({ label }) => label)
    .join(' · ')

export const getSelectionKey = (selection: DishSelection) =>
  Object.entries(selection)
    .filter(([, choices]) => choices.length > 0)
    .map(([groupId, choices]) => `${groupId}=${[...choices].sort().join('+')}`)
    .sort()
    .join('|')

/** Each chosen option with its own price, for the separate lines in the basket. */
export const getSelectedOptions = (
  groups: OptionGroup[],
  selection: DishSelection,
): CartItemOption[] =>
  groups.flatMap((group) =>
    selectedChoices(group, selection).map(({ label, priceDelta }) => ({
      groupTitle: group.title,
      label,
      price: priceDelta,
    })),
  )

/** The group to look at after answering `group`: the next one still unanswered, if any. */
export const getNextGroup = (
  groups: OptionGroup[],
  group: OptionGroup,
  selection: DishSelection,
) => {
  const after = groups.slice(groups.indexOf(group) + 1)
  return (
    after.find(({ id, required }) => required && !selection[id]?.length) ??
    after.find(({ id }) => !selection[id]?.length)
  )
}
