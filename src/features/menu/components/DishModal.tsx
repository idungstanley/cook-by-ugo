import { useMemo } from 'react'
import { Starburst } from '@/components/brand/Starburst'
import { Button } from '@/components/ui/Button'
import { CloseButton, Modal } from '@/components/ui/Overlay'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { useDishSelection } from '@/hooks/useDishSelection'
import { formatPrice } from '@/lib/format'
import { useDishes, useFavourites, useOptionGroups } from '@/services/menu/menu.queries'
import { useCartStore } from '@/stores/cart.store'
import { useUiStore } from '@/stores/ui.store'
import type { Category, Dish, OptionGroup } from '@/types'
import { OptionGroupField } from './OptionGroupField'

const CATEGORY_LABELS: Record<Category['id'], string> = {
  'rice-swallow': 'Rice & swallow',
  'grills-protein': 'Grills & protein',
  'sides-snacks': 'Sides & snacks',
  drinks: 'Drinks',
}

interface DishFormProps {
  dish: Dish
  groups: OptionGroup[]
  isMostOrdered: boolean
  onClose: () => void
}

const DishForm = ({ dish, groups, isMostOrdered, onClose }: DishFormProps) => {
  const addItem = useCartStore((state) => state.addItem)
  const {
    selection,
    quantity,
    setQuantity,
    totalPrice,
    unitPrice,
    missingGroup,
    summary,
    optionKey,
    toggle,
  } = useDishSelection(dish, groups)

  const addToOrder = () => {
    addItem({
      productId: dish.id,
      name: dish.name,
      image: dish.image,
      unitPrice,
      quantity,
      summary,
      optionKey,
      selection,
    })
    onClose()
  }

  return (
    <div className="relative grid max-h-[94dvh] grid-rows-[auto_1fr] overflow-y-auto md:max-h-[min(760px,92dvh)] md:grid-cols-[42%_1fr] md:grid-rows-1 md:overflow-hidden">
      <CloseButton onClick={onClose} className="absolute right-4 top-4 z-10" />

      <div className="relative p-3 md:p-3 md:pr-0">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-44 w-full rounded-3xl object-cover md:h-full md:rounded-b-3xl md:rounded-t-full"
        />
        {isMostOrdered && (
          <Starburst
            points={16}
            className="absolute bottom-0 right-3 size-24 text-gold max-md:hidden md:bottom-4 md:right-0 md:size-28"
          >
            <span className="block text-center font-display text-sm font-extrabold leading-none text-cocoa">
              MOST
              <br />
              ORDERED
            </span>
          </Starburst>
        )}
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="flex flex-col gap-5 px-5 pb-4 pt-2 md:flex-1 md:overflow-y-auto md:px-8 md:pt-8">
          <div>
            <p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-jollof md:block">
              {CATEGORY_LABELS[dish.categoryId]}
            </p>
            <h2 className="text-3xl md:mt-1 md:text-4xl">{dish.name}</h2>
            <p className="mt-2 hidden text-sm text-muted md:block">
              {dish.longDescription ?? dish.description}
            </p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold">
                {formatPrice(dish.price)}
              </span>
              <span className="text-xs text-muted">{dish.kcal} kcal</span>
            </p>
          </div>

          {groups.map((group) => (
            <OptionGroupField
              key={group.id}
              group={group}
              selected={selection[group.id] ?? []}
              onToggle={(choiceId) => toggle(group, choiceId)}
            />
          ))}

          <p className="rounded-2xl bg-shea px-4 py-3 text-xs leading-relaxed text-muted">
            <strong className="text-cocoa">Allergens: </strong>
            {dish.allergens.length > 0 ? dish.allergens.join(', ') : 'None listed'}. Prepared in a
            kitchen that handles all 14 major allergens.
          </p>
        </div>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-paper px-5 py-3 md:px-8 md:py-4">
          <QuantityStepper value={quantity} label="quantity" size="lg" onChange={setQuantity} />
          <Button
            size="lg"
            fullWidth
            disabled={Boolean(missingGroup)}
            onClick={addToOrder}
            className="flex-1 px-4"
          >
            {missingGroup
              ? (missingGroup.promptLabel ?? 'Complete your choices')
              : `Add to order · ${formatPrice(totalPrice)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const DishModal = () => {
  const activeDishId = useUiStore((state) => state.activeDishId)
  const closeDish = useUiStore((state) => state.closeDish)
  const { data: dishes } = useDishes()
  const { data: allGroups } = useOptionGroups()
  const { data: favourites } = useFavourites()

  const dish = dishes?.find(({ id }) => id === activeDishId)
  const groups = useMemo(
    () =>
      (dish?.optionGroupIds ?? []).flatMap(
        (groupId) => allGroups?.filter(({ id }) => id === groupId) ?? [],
      ),
    [dish, allGroups],
  )
  const isMostOrdered = favourites?.[0]?.dishId === dish?.id

  return (
    <Modal open={Boolean(dish)} onClose={closeDish} label={dish?.name ?? 'Dish'}>
      {dish && (
        <DishForm
          key={dish.id}
          dish={dish}
          groups={groups}
          isMostOrdered={isMostOrdered}
          onClose={closeDish}
        />
      )}
    </Modal>
  )
}
