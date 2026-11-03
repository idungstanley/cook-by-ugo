import { cn } from '@/lib/cn'

const VARIANTS = {
  primary: 'bg-jollof text-white hover:bg-jollof-dark',
  dark: 'bg-cocoa text-paper hover:bg-cocoa-soft',
  outline: 'border border-cocoa/70 text-cocoa hover:bg-cocoa hover:text-paper',
  light: 'bg-shea text-cocoa hover:bg-paper',
  whatsapp: 'bg-whatsapp text-cocoa hover:brightness-95',
  ghost: 'text-cocoa underline-offset-4 hover:underline',
} as const

const SIZES = {
  sm: 'h-9 gap-1 px-4 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-14 gap-2 px-7 text-base',
} as const

export interface ButtonStyleProps {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  fullWidth?: boolean
  className?: string
}

/** Shared with router links, so links and buttons always look the same. */
export const buttonStyles = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: ButtonStyleProps = {}) =>
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-body font-bold transition',
    'duration-200 ease-out hover:scale-105 active:scale-95 disabled:scale-100 motion-reduce:transform-none',
    'disabled:cursor-not-allowed disabled:bg-cocoa/10 disabled:text-muted',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  )
