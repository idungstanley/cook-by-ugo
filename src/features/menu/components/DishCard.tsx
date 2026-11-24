import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { FoodImage } from '@/components/ui/FoodImage'
import { Tag } from '@/components/ui/Tag'
import { CARD_HOVER, fadeUp } from '@/constants/motion'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useDishOffer } from '@/services/offers/offers.queries'
import { useUiStore } from '@/stores/ui.store'
import type { Dish } from '@/types'

const BADGE_TONES = { Popular: 'gold', Spicy: 'jollof' } as const

interface DishCardProps {
  dish: Dish
  /** Replaces the dish badges, for example "Most ordered" on the home page. */
  tag?: string
  description?: string
}

/**
 * Laid out like an Uber Eats menu item: words on the left and a large square photo on the
 * right, so the food is the first thing you see. The whole card opens the dish.
 */
export const DishCard = ({ dish, tag, description }: DishCardProps) => {
  const openDish = useUiStore((state) => state.openDish)
  const offer = useDishOffer(dish.id)
  const text = description ?? dish.description

  return (
    <motion.article variants={fadeUp} whileHover={dish.soldOut ? undefined : CARD_HOVER}>
      <button
        type="button"
        disabled={dish.soldOut}
        onClick={() => openDish(dish.id)}
        aria-label={
          dish.soldOut ? `${dish.name}, sold out` : `${dish.name}, ${formatPrice(dish.price)}`
        }
        className={cn(
          'group flex h-full w-full items-stretch gap-4 rounded-card bg-paper p-3 text-left transition-shadow',
          'hover:shadow-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jollof',
          dish.soldOut && 'cursor-not-allowed opacity-60',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col py-1 pl-1">
          <div className="mb-1.5 flex flex-wrap gap-1">
            {offer && <Tag tone="jollof">{offer.label}</Tag>}
            {tag ? (
              <Tag className="bg-shea">{tag}</Tag>
            ) : (
              dish.badges.map((badge) => (
                <Tag key={badge} tone={BADGE_TONES[badge]}>
                  {badge}
                </Tag>
              ))
            )}
          </div>
          <h3 className="text-lg font-bold leading-tight md:text-xl">{dish.name}</h3>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold">
              {dish.soldOut ? 'Sold out' : formatPrice(dish.price)}
            </span>
            {Boolean(dish.kcal) && <span className="text-xs text-muted">{dish.kcal} kcal</span>}
          </p>
          {text && <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{text}</p>}
        </div>

        <div className="relative size-32 shrink-0 md:size-36">
          <FoodImage
            src={dish.image}
            alt=""
            loading="lazy"
            className="size-full rounded-2xl transition duration-500 group-hover:scale-[1.03]"
          />
          {!dish.soldOut && (
            <span
              aria-hidden
              className="absolute bottom-2 right-2 grid size-10 place-items-center rounded-full bg-paper text-cocoa shadow-float transition group-hover:scale-110 group-hover:bg-jollof group-hover:text-white"
            >
              <Plus className="size-5" strokeWidth={3} />
            </span>
          )}
        </div>
      </button>
    </motion.article>
  )
}
