import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export const Container = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('mx-auto w-full max-w-site px-5 md:px-10 xl:px-20', className)} {...props} />
)
