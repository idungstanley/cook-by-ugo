import { cn } from '@/lib/cn'

interface LogoMarkProps {
  /** Sits the logo on a cream disc, because its dark lettering disappears on dark surfaces. */
  onDark?: boolean
  className?: string
}

export const LogoMark = ({ onDark, className }: LogoMarkProps) => (
  <img
    src="/logo.svg"
    alt="Cooked by Ugo"
    width={80}
    height={80}
    className={cn('size-16 md:size-20', onDark && 'rounded-full bg-paper p-1.5', className)}
  />
)
