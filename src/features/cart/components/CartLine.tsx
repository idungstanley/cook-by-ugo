import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart.store'
import type { CartItem } from '@/types'

export const CartLine = ({ item }: { item: CartItem }) => {
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <li className="flex gap-3 border-b border-line py-4 last:border-b-0">
      <img src={item.image} alt="" className="size-20 shrink-0 rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight">{item.name}</h3>
          <p className="font-display text-lg font-extrabold">
            {formatPrice(item.unitPrice * item.quantity)}
          </p>
        </div>
        <p className="mb-2 mt-0.5 text-xs text-jollof">
          {item.summary || `${formatPrice(item.unitPrice)} each`}
        </p>
        <div className="flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            min={1}
            label={item.name}
            onChange={(quantity) => setQuantity(item.id, quantity)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-xs font-semibold text-muted underline-offset-2 hover:text-cocoa hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
