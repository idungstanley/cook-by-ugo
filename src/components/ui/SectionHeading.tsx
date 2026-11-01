import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  accent: ReactNode
  tone?: 'light' | 'dark'
  as?: 'h1' | 'h2'
  className?: string
}

export const SectionHeading = ({
  eyebrow,
  title,
  accent,
  tone = 'light',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) => (
  <div className={className}>
    <p
      className={cn(
        'mb-3 text-xs font-bold uppercase tracking-[0.16em]',
        tone === 'light' ? 'text-jollof' : 'text-gold',
      )}
    >
      {eyebrow}
    </p>
    <Heading
      className={cn(
        'text-[2.5rem] leading-[1.05] md:text-6xl',
        tone === 'light' ? 'text-cocoa' : 'text-paper',
      )}
    >
      {title}
      <span
        className={cn(
          'block font-accent font-semibold italic tracking-normal',
          tone === 'light' ? 'text-jollof' : 'text-gold',
        )}
      >
        {accent}
      </span>
    </Heading>
  </div>
)
