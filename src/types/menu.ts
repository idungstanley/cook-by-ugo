/** All money values are whole pence, so totals never hit floating point rounding. */
export type Pence = number

export type DishBadge = 'Popular' | 'Spicy'

export type CategoryId = 'rice-swallow' | 'grills-protein' | 'sides-snacks' | 'drinks'

export interface Category {
  id: CategoryId
  name: string
  shortName: string
  accent: 'jollof' | 'ewedu' | 'indigo' | 'gold'
}

export interface OptionChoice {
  id: string
  label: string
  priceDelta: Pence
}

export type OptionGroupKind = 'radio' | 'chips' | 'segmented'

export interface OptionGroup {
  id: string
  title: string
  kind: OptionGroupKind
  required: boolean
  helperText?: string
  maxChoices: number
  defaultChoiceId?: string
  /** Text for the disabled add button while this required group is unanswered. */
  promptLabel?: string
  choices: OptionChoice[]
}

export interface Dish {
  id: string
  categoryId: CategoryId
  name: string
  description: string
  shortDescription: string
  /** Longer description for the dish pop-up, when it differs from the card. */
  longDescription?: string
  price: Pence
  kcal: number
  image: string
  badges: DishBadge[]
  allergens: string[]
  optionGroupIds: string[]
  soldOut?: boolean
}

export interface FavouriteDish {
  dishId: string
  tag: string
  description: string
}

export interface MenuSection {
  category: Category
  dishes: Dish[]
}
