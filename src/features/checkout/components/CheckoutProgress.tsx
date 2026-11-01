import { Check } from 'lucide-react'
import { Fragment } from 'react'
import { CHECKOUT_STEPS, type CheckoutStep } from '@/constants/checkout'
import { cn } from '@/lib/cn'

export const CheckoutProgress = ({ current }: { current: CheckoutStep }) => {
  const currentIndex = CHECKOUT_STEPS.findIndex(({ id }) => id === current)

  return (
    <ol className="flex items-center gap-2" aria-label="Checkout progress">
      {CHECKOUT_STEPS.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <Fragment key={step.id}>
            {index > 0 && (
              <li
                aria-hidden
                className={cn(
                  'h-0.5 flex-1 rounded-full',
                  isDone || isCurrent ? 'bg-ewedu' : 'bg-line',
                )}
              />
            )}
            <li
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2 text-sm',
                isCurrent ? 'font-bold' : 'font-medium',
                !isDone && !isCurrent && 'text-muted',
              )}
            >
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full text-xs font-bold',
                  isDone && 'bg-ewedu text-white',
                  isCurrent && 'bg-jollof text-white',
                  !isDone && !isCurrent && 'border border-line bg-shea',
                )}
              >
                {isDone ? <Check className="size-4" strokeWidth={3} /> : index + 1}
              </span>
              {step.label}
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
