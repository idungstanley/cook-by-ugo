import { useCartTotals } from '@/hooks/useCartTotals'
import { formatPrice, pluralise } from '@/lib/format'
import { useUiStore } from '@/stores/ui.store'

export const MobileBasketBar = () => {
  const { itemCount, subtotal } = useCartTotals()
  const openPanel = useUiStore((state) => state.openPanel)

  if (itemCount === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 px-4 md:hidden">
      <button
        type="button"
        onClick={() => openPanel('cart')}
        className="pointer-events-auto flex h-14 w-full items-center justify-between rounded-2xl bg-cocoa px-5 text-sm font-semibold text-paper shadow-panel"
      >
        <span>
          {pluralise(itemCount, 'item')} · {formatPrice(subtotal)}
        </span>
        <span className="font-bold text-gold">View order →</span>
      </button>
    </div>
  )
}
