import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface StarburstProps {
  points?: number
  innerRatio?: number
  className?: string
  children?: ReactNode
}

const buildPolygon = (points: number, innerRatio: number) =>
  Array.from({ length: points * 2 }, (_, index) => {
    const radius = index % 2 === 0 ? 50 : 50 * innerRatio
    const angle = (Math.PI * index) / points - Math.PI / 2
    return `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')

/** The stamped seal from the brand kit. Set its colour with a `text-*` class. */
export const Starburst = ({
  points = 14,
  innerRatio = 0.8,
  className,
  children,
}: StarburstProps) => (
  <span className={cn('relative inline-grid place-items-center', className)}>
    <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full fill-current">
      <polygon points={buildPolygon(points, innerRatio)} />
    </svg>
    {children && <span className="relative">{children}</span>}
  </span>
)
