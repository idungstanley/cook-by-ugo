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
      'grid size-11 shrink-0 place-items-center rounded-full bg-shea text-cocoa transition duration-200 ease-out hover:scale-105 hover:bg-line active:scale-95 disabled:scale-100 motion-reduce:transform-none',
      className,
    )}
    {...props}
  />
)
