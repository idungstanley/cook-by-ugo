import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart.store'
import { useUiStore } from '@/stores/ui.store'
import type { Deal, DealTheme } from '@/types'

const THEMES: Record<DealTheme, string> = {
  jollof: 'bg-jollof',
  ewedu: 'bg-ewedu',
  indigo: 'bg-indigo',
}

export const DealCard = ({ deal }: { deal: Deal }) => {
  const addItem = useCartStore((state) => state.addItem)
  const openPanel = useUiStore((state) => state.openPanel)

  const orderDeal = () => {
    addItem({
      productId: deal.id,
      name: deal.name,
      image: deal.image,
      unitPrice: deal.price,
    })
    openPanel('cart')
  }

  return (
    <article
      className={cn(
        'relative flex min-h-[370px] flex-col overflow-hidden rounded-card p-6 text-white',
        THEMES[deal.theme],
      )}
    >
      <img
        src={deal.image}
        alt=""
        loading="lazy"
        className="absolute right-0 top-0 h-44 w-[46%] object-cover object-left"
      />
      <Tag className="relative self-start">{deal.tag}</Tag>

      <div className="relative mt-auto">
        <h3 className="text-3xl">{deal.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/90">{deal.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold">{formatPrice(deal.price)}</span>
            <span className="text-sm text-white/75 line-through">
              was {formatPrice(deal.wasPrice)}
            </span>
          </p>
          <Button variant="light" onClick={orderDeal} aria-label={`Order ${deal.name}`}>
            Order
          </Button>
        </div>
      </div>
    </article>
  )
}
