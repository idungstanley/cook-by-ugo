import { FoodImage } from '@/components/ui/FoodImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { formatPrice } from '@/lib/format'
import { useCartStore } from '@/stores/cart.store'
import type { CartItem } from '@/types'

/** The dish, then each chosen option on its own line with its own price, then the note. */
export const CartLine = ({ item }: { item: CartItem }) => {
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <li className="flex gap-3 border-b border-line py-4 last:border-b-0">
      <FoodImage src={item.image} alt="" className="size-16 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <ul className="flex flex-col gap-1">
          <li className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold leading-tight">{item.name}</h3>
            <span className="font-semibold">{formatPrice(item.basePrice * item.quantity)}</span>
          </li>
          {item.options.map((option) => (
            <li
              key={`${option.groupTitle}-${option.label}`}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="text-cocoa/80">
                <span aria-hidden className="mr-1.5 text-jollof">
                  +
                </span>
                {option.label}
              </span>
              <span className="text-muted">
                {option.price > 0 ? formatPrice(option.price * item.quantity) : 'Included'}
              </span>
            </li>
          ))}
        </ul>
        {item.note && <p className="mt-1.5 text-xs italic text-muted">“{item.note}”</p>}

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            min={1}
            label={item.name}
            onChange={(quantity) => setQuantity(item.id, quantity)}
          />
          <div className="text-right">
            <p className="font-display text-lg font-extrabold leading-none">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-xs font-semibold text-muted underline-offset-2 hover:text-cocoa hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
