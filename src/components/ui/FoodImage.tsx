import type { ComponentProps } from 'react'
import { LogoMark } from '@/components/brand/LogoMark'
import { cn } from '@/lib/cn'

/** A dish photo, or the logo on a warm background when the kitchen has not added one yet. */
export const FoodImage = ({ src, alt = '', className, ...props }: ComponentProps<'img'>) =>
  src ? (
    <img src={src} alt={alt} className={cn('object-cover', className)} {...props} />
  ) : (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      className={cn('grid place-items-center bg-shea', className)}
    >
      <LogoMark className="h-1/2 max-h-24 w-auto opacity-60" />
    </div>
  )
