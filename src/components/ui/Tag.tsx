import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const TONES = {
  gold: 'bg-gold text-cocoa',
  jollof: 'bg-jollof text-white',
  ewedu: 'bg-ewedu text-white',
  paper: 'bg-paper text-cocoa',
} as const

interface TagProps extends ComponentProps<'span'> {
  tone?: keyof typeof TONES
}

export const Tag = ({ tone = 'paper', className, ...props }: TagProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold leading-none',
      TONES[tone],
      className,
    )}
    {...props}
  />
)
