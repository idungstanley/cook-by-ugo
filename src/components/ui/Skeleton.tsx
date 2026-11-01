import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => (
  <div aria-hidden className={cn('animate-pulse rounded-card bg-line/70', className)} {...props} />
)
