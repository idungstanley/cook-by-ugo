import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface RadioCardProps {
  name: string
  selected: boolean
  onSelect: () => void
  title: ReactNode
  description?: string
  disabled?: boolean
  className?: string
}

export const RadioCard = ({
  name,
  selected,
  onSelect,
  title,
  description,
  disabled,
  className,
}: RadioCardProps) => (
  <label
    className={cn(
      'relative flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition',
      'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-jollof',
      disabled && 'cursor-not-allowed opacity-50',
      selected
        ? 'border-cocoa bg-cocoa text-paper'
        : 'border-line bg-shea text-cocoa hover:border-cocoa/40',
      className,
    )}
  >
    <input
      type="radio"
      name={name}
      checked={selected}
      disabled={disabled}
      onChange={onSelect}
      className="sr-only"
    />
    <span
      aria-hidden
      className={cn(
        'size-4 shrink-0 rounded-full border',
        selected ? 'border-gold bg-gold' : 'border-muted bg-transparent',
      )}
    />
    <span className="min-w-0">
      <span className="block text-sm font-bold">{title}</span>
      {description && (
        <span className={cn('block text-xs', selected ? 'text-paper/70' : 'text-muted')}>
          {description}
        </span>
      )}
    </span>
  </label>
)
