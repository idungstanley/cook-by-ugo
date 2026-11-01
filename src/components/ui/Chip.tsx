import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

interface ChipProps extends ComponentProps<'button'> {
  active?: boolean
}

export const Chip = ({ active, className, ...props }: ChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    className={cn(
      'h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition',
      active
        ? 'border-cocoa bg-cocoa text-paper'
        : 'border-line bg-transparent text-cocoa hover:border-cocoa',
      className,
    )}
    {...props}
  />
)
