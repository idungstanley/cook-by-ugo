import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

interface IconButtonProps extends ComponentProps<'button'> {
  label: string
}

export const IconButton = ({ label, className, ...props }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    className={cn(
      'grid size-11 shrink-0 place-items-center rounded-full bg-shea text-cocoa transition hover:bg-line',
      className,
    )}
    {...props}
  />
)
