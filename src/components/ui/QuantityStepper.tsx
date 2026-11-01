import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

interface QuantityStepperProps {
  value: number
  min?: number
  label: string
  onChange: (value: number) => void
  size?: 'sm' | 'lg'
}

export const QuantityStepper = ({
  value,
  min = 1,
  label,
  onChange,
  size = 'sm',
}: QuantityStepperProps) => {
  const buttonClass = cn(
    'grid place-items-center rounded-full transition hover:bg-shea disabled:opacity-40',
    size === 'sm' ? 'size-8' : 'size-11',
  )

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper p-0.5">
      <button
        type="button"
        className={buttonClass}
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="min-w-7 text-center text-sm font-bold">
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        aria-label={`Increase ${label}`}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
