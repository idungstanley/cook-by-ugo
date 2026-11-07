import { useMemo, useRef, useState } from 'react'
import { Starburst } from '@/components/brand/Starburst'
import { Button } from '@/components/ui/Button'
import { TextAreaField } from '@/components/ui/fields'
import { FoodImage } from '@/components/ui/FoodImage'
import { CloseButton, Modal } from '@/components/ui/Overlay'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Tag } from '@/components/ui/Tag'
import { getNextGroup } from '@/features/menu/dishSelection'
import { useDishSelection } from '@/hooks/useDishSelection'
import { formatPrice } from '@/lib/format'
import { useDishes, useFavourites, useOptionGroups } from '@/services/menu/menu.queries'
import { useDishOffer } from '@/services/offers/offers.queries'
import { useCartStore } from '@/stores/cart.store'
import { useReplacementStore } from '@/stores/replacement.store'
import { useUiStore } from '@/stores/ui.store'
import type { Category, Dish, OptionGroup } from '@/types'
import { OptionGroupField } from './OptionGroupField'

const CATEGORY_LABELS: Partial<Record<Category['id'], string>> = {
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

const HIGHLIGHT_MS = 1600

const DishForm = ({ dish, groups, isMostOrdered, onClose }: DishFormProps) => {
  const addToCart = useCartStore((state) => state.addItem)
  const replacing = useReplacementStore((state) => Boolean(state.orderId))
  const addReplacement = useReplacementStore((state) => state.addItem)
  const addItem = replacing ? addReplacement : addToCart
  const offer = useDishOffer(dish.id)
  const groupRefs = useRef(new Map<string, HTMLFieldSetElement>())
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const {
    selection,
    quantity,
    setQuantity,
    note,
    setNote,
    totalPrice,
    unitPrice,
    missingGroup,
    options,
    summary,
    optionKey,
    toggle,
  } = useDishSelection(dish, groups)

  const showGroup = (groupId: string, highlight = false) => {
    groupRefs.current.get(groupId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (highlight) {
      setHighlighted(groupId)
      window.setTimeout(() => setHighlighted(null), HIGHLIGHT_MS)
    }
  }

  /** After a single choice, move the customer straight on to the next thing to choose. */
  const choose = (group: OptionGroup, choiceId: string) => {
    const next = toggle(group, choiceId)
    if (group.maxChoices !== 1) return
    const following = getNextGroup(groups, group, next)
    if (following) window.setTimeout(() => showGroup(following.id), 150)
  }

  const addToOrder = () => {
    if (missingGroup) {
      showGroup(missingGroup.id, true)
      return
    }
    addItem({
      productId: dish.id,
      name: dish.name,
      image: dish.image,
      basePrice: dish.price,
      options,
      unitPrice,
      quantity,
      summary,
      note: note.trim() || undefined,
      optionKey,
      selection,
    })
    onClose()
  }

  return (
    <div className="relative grid max-h-[94dvh] grid-rows-[auto_1fr] overflow-y-auto md:max-h-[min(760px,92dvh)] md:grid-cols-[42%_1fr] md:grid-rows-1 md:overflow-hidden">
      <CloseButton onClick={onClose} className="absolute right-4 top-4 z-10" />

      <div className="relative p-3 md:p-3 md:pr-0">
        <FoodImage
          src={dish.image}
          alt={dish.name}
          className="h-44 w-full rounded-3xl md:h-full md:rounded-b-3xl md:rounded-t-full"
        />
        {offer && (
          <Tag tone="jollof" className="absolute left-6 top-6">
            {offer.label}
          </Tag>
        )}
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
        <div className="flex flex-col gap-6 px-5 pb-4 pt-2 md:flex-1 md:overflow-y-auto md:px-8 md:pt-8">
          <div>
            <p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-jollof md:block">
              {CATEGORY_LABELS[dish.categoryId] ?? 'Menu'}
            </p>
            <h2 className="pr-12 text-3xl md:mt-1 md:text-4xl">{dish.name}</h2>
            {(dish.longDescription ?? dish.description) && (
              <p className="mt-2 text-sm text-muted">{dish.longDescription ?? dish.description}</p>
            )}
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold">
                {formatPrice(dish.price)}
              </span>
              {Boolean(dish.kcal) && <span className="text-xs text-muted">{dish.kcal} kcal</span>}
            </p>
          </div>

          {groups.map((group) => (
            <OptionGroupField
              key={group.id}
              ref={(element) => {
                if (element) groupRefs.current.set(group.id, element)
                else groupRefs.current.delete(group.id)
              }}
              group={group}
              selected={selection[group.id] ?? []}
              highlighted={highlighted === group.id}
              onToggle={(choiceId) => choose(group, choiceId)}
            />
          ))}

          <TextAreaField
            label="Special instructions (optional)"
            placeholder="Not too spicy, use turkey, add cutlery..."
            maxLength={200}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />

          <p className="rounded-2xl bg-shea px-4 py-3 text-xs leading-relaxed text-muted">
            <strong className="text-cocoa">Allergens: </strong>
            {dish.allergens.length > 0 ? dish.allergens.join(', ') : 'None listed'}. Prepared in a
            kitchen that handles all 14 major allergens. Tell us about any allergy at checkout.
          </p>
        </div>

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-paper px-5 py-3 md:px-8 md:py-4">
          <QuantityStepper value={quantity} label="quantity" size="lg" onChange={setQuantity} />
          <Button
            size="lg"
            fullWidth
            variant={missingGroup ? 'dark' : 'primary'}
            onClick={addToOrder}
            className="flex-1 px-4"
          >
            {missingGroup
              ? `Choose ${missingGroup.title.replace(/^choose (your |a )?/i, '').toLowerCase()} →`
              : `${replacing ? 'Add as replacement' : 'Add to order'} · ${formatPrice(totalPrice)}`}
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
