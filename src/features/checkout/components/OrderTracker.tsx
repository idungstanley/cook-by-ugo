import { Tag } from '@/components/ui/Tag'
import { ORDER_STAGES } from '@/constants/checkout'
import { cn } from '@/lib/cn'
import type { OrderStatus } from '@/types'

export const OrderTracker = ({ status }: { status: OrderStatus }) => {
  const currentIndex = ORDER_STAGES.findIndex((stage) => stage.status === status)

  return (
    <ol aria-label="Order progress">
      {ORDER_STAGES.map((stage, index) => {
        const isPast = index < currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === ORDER_STAGES.length - 1

        return (
          <li
            key={stage.status}
            aria-current={isCurrent ? 'step' : undefined}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute bottom-0 left-[9px] top-5 w-0.5',
                  isPast ? 'bg-ewedu' : 'bg-line',
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                'relative size-5 shrink-0 rounded-full border-2',
                isPast && 'border-ewedu bg-ewedu',
                isCurrent && 'border-gold bg-gold',
                !isPast && !isCurrent && 'border-muted/50 bg-paper',
              )}
            />
            <div className="min-w-0 flex-1">
              <p className={cn('font-bold leading-tight', !isPast && !isCurrent && 'text-muted')}>
                {stage.title}
              </p>
              <p className="text-xs text-muted">{stage.body}</p>
            </div>
            {isCurrent && (
              <Tag tone="gold" className="self-start">
                Now
              </Tag>
            )}
          </li>
        )
      })}
    </ol>
  )
}
