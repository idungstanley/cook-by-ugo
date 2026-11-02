import type { OptionGroup } from '@/types'

export const optionGroups: OptionGroup[] = [
  {
    id: 'protein',
    title: 'Choose your protein',
    kind: 'radio',
    required: true,
    maxChoices: 1,
    promptLabel: 'Choose a protein to continue',
    choices: [
      { id: 'chicken', label: 'Chicken', priceDelta: 0 },
      { id: 'beef', label: 'Beef', priceDelta: 0 },
      { id: 'fish', label: 'Fish', priceDelta: 0 },
      { id: 'vegetarian', label: 'Vegetarian', priceDelta: 0 },
    ],
  },
  {
    id: 'sides',
    title: 'Add a side',
    kind: 'chips',
    required: false,
    helperText: 'Optional, up to 2',
    maxChoices: 2,
    choices: [
      { id: 'fried-plantain', label: 'Fried Plantain', priceDelta: 150 },
      { id: 'moi-moi', label: 'Moi Moi', priceDelta: 149 },
      { id: 'coleslaw', label: 'Coleslaw', priceDelta: 99 },
      { id: 'extra-sauce', label: 'Extra sauce', priceDelta: 50 },
    ],
  },
  {
    id: 'spice',
    title: 'Spice level',
    kind: 'segmented',
    required: true,
    maxChoices: 1,
    defaultChoiceId: 'medium',
    choices: [
      { id: 'mild', label: 'Mild', priceDelta: 0 },
      { id: 'medium', label: 'Medium', priceDelta: 0 },
      { id: 'naija-hot', label: 'Naija hot', priceDelta: 0 },
    ],
  },
]
