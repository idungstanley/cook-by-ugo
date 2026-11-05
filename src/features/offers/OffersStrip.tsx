import { Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { useDishes } from '@/services/menu/menu.queries'
import { useOffers } from '@/services/offers/offers.queries'
import { useUiStore } from '@/stores/ui.store'
import type { Dish, Offer } from '@/types'

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

const describe = (offer: Offer, dishes: Dish[]) => {
  const names = offer.dishIds
    .map((id) => dishes.find((dish) => dish.id === id)?.name)
    .filter(Boolean)
  const scope = names.length
    ? ` on ${names.slice(0, 2).join(' & ')}${names.length > 2 ? ' and more' : ''}`
    : ''
  const minimum = offer.minSubtotal ? ` over ${formatPrice(offer.minSubtotal)}` : ''
  const ends = offer.endsAt ? ` · ends ${dateFormat.format(offer.endsAt)}` : ''
  return `${offer.label}${scope}${minimum && !scope ? ` on orders${minimum}` : minimum}${ends}`
}

/** Live offers as tappable pills. Hidden when nothing is running. */
export const OffersStrip = ({ className }: { className?: string }) => {
  const { data: offers } = useOffers()
  const { data: dishes = [] } = useDishes()
  const openDish = useUiStore((state) => state.openDish)

  if (!offers?.length) return null

  return (
    <div className={className}>
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        {offers.map((offer) => {
          const firstDish = offer.dishIds[0]
          return (
            <li key={offer.id} className="shrink-0">
              <button
                type="button"
                disabled={!firstDish}
                onClick={() => firstDish && openDish(firstDish)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-jollof px-4 text-sm font-bold text-white transition enabled:hover:scale-105 enabled:hover:bg-jollof-dark disabled:cursor-default"
              >
                <Sparkles className="size-4" /> {describe(offer, dishes)}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
