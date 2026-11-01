import { Plus } from 'lucide-react'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'
import type { Dish } from '@/types'

const BADGE_TONES = { Popular: 'gold', Spicy: 'jollof' } as const

interface DishCardProps {
  dish: Dish
  /** Replaces the dish badges, for example "Most ordered" on the home page. */
  tag?: string
  description?: string
  /** `row` collapses into a compact list item on phones, as in the mobile menu design. */
  layout?: 'stacked' | 'row'
}

export const DishCard = ({ dish, tag, description, layout = 'stacked' }: DishCardProps) => {
  const openDish = useUiStore((state) => state.openDish)
  const isRow = layout === 'row'

  return (
    <article
      className={cn(
        'relative flex rounded-card bg-paper p-3 transition hover:shadow-float',
        isRow ? 'items-center gap-3 md:flex-col md:items-stretch md:gap-0' : 'flex-col',
        dish.soldOut && 'opacity-60',
      )}
    >
      <div className={cn('relative shrink-0', isRow ? 'w-[88px] md:w-full' : 'w-full')}>
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className={cn(
            'w-full object-cover',
            isRow
              ? 'aspect-square rounded-2xl md:aspect-[278/210] md:rounded-b-2xl md:rounded-t-full'
              : 'aspect-[278/210] rounded-b-2xl rounded-t-full',
          )}
        />
        <div
          className={cn('absolute left-2 top-2 flex flex-wrap gap-1', isRow && 'hidden md:flex')}
        >
          {tag ? (
            <Tag>{tag}</Tag>
          ) : (
            dish.badges.map((badge) => (
              <Tag key={badge} tone={BADGE_TONES[badge]}>
                {badge}
              </Tag>
            ))
          )}
        </div>
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          isRow ? 'md:px-2 md:pt-4' : 'px-1 pt-3 md:px-2 md:pt-4',
        )}
      >
        <h3 className="text-lg font-bold leading-tight md:text-xl">{dish.name}</h3>
        <p
          className={cn(
            'mt-1 text-[13px] leading-snug text-muted md:mb-4 md:text-sm',
            isRow ? 'mb-0' : 'mb-3',
          )}
        >
          {isRow ? (
            <>
              <span className="md:hidden">{dish.shortDescription}</span>
              <span className="hidden md:inline">{description ?? dish.description}</span>
            </>
          ) : (
            (description ?? dish.description)
          )}
        </p>

        <div
          className={cn('mt-auto flex items-center justify-between gap-2', isRow && 'max-md:pt-1')}
        >
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-extrabold md:text-2xl">
              {formatPrice(dish.price)}
            </span>
            <span className={cn('text-xs text-muted', isRow && 'hidden md:inline')}>
              {dish.kcal} kcal
            </span>
          </p>
          <button
            type="button"
            disabled={dish.soldOut}
            aria-label={`Add ${dish.name}`}
            onClick={() => openDish(dish.id)}
            className={cn(
              'hidden h-9 shrink-0 items-center gap-1 rounded-full bg-jollof px-4 text-sm font-bold text-white transition hover:bg-jollof-dark disabled:bg-cocoa/20',
              isRow ? 'md:inline-flex' : 'inline-flex',
            )}
          >
            {dish.soldOut ? 'Sold out' : 'Add +'}
          </button>
        </div>
      </div>

      {isRow && (
        <button
          type="button"
          disabled={dish.soldOut}
          aria-label={`Add ${dish.name}`}
          onClick={() => openDish(dish.id)}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-jollof text-white disabled:bg-cocoa/20 md:hidden"
        >
          <Plus className="size-5" strokeWidth={3} />
        </button>
      )}
    </article>
  )
}
