import { formatPrice } from '@/lib/format'
import type { OrderLine } from '@/types'

/** Each dish with its options on their own priced lines, as in the basket. */
export const OrderLines = ({ items }: { items: OrderLine[] }) => (
  <ul className="flex flex-col divide-y divide-line">
    {items.map((item) => (
      <li key={item.id} className="py-3 text-sm">
        <div className="flex justify-between gap-3 font-semibold">
          <span>
            {item.quantity} × {item.name}
          </span>
          <span>{formatPrice((item.basePrice ?? item.unitPrice) * item.quantity)}</span>
        </div>
        {item.options?.length
          ? item.options.map((option) => (
              <div
                key={`${option.groupTitle}-${option.label}`}
                className="flex justify-between gap-3 text-muted"
              >
                <span>+ {option.label}</span>
                <span>{option.price ? formatPrice(option.price * item.quantity) : 'Included'}</span>
              </div>
            ))
          : item.summary && <p className="text-muted">{item.summary}</p>}
        {item.note && <p className="mt-0.5 text-xs italic text-muted">“{item.note}”</p>}
      </li>
    ))}
  </ul>
)
