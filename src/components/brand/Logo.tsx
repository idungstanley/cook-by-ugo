import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/cn'
import { Starburst } from './Starburst'

export const Logo = ({ className }: { className?: string }) => (
  <Link
    to="/"
    aria-label="Cook by Ugo home"
    className={cn('inline-flex items-center gap-2', className)}
  >
    <Starburst points={12} innerRatio={0.72} className="size-7 text-jollof">
      <span className="block size-3.5 rounded-full bg-gold" />
    </Starburst>
    <span className="font-display text-2xl font-extrabold tracking-tight">cook by ugo</span>
  </Link>
)
