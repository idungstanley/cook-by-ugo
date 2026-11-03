import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Stagger } from '@/components/motion/Stagger'
import { fadeUp, stagger } from '@/constants/motion'
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
  as = 'h2',
  className,
}: SectionHeadingProps) => {
  const Heading = as === 'h1' ? motion.h1 : motion.h2

  return (
    <Stagger gap={0.12} className={className}>
      <motion.p
        variants={fadeUp}
        className={cn(
          'mb-3 text-xs font-bold uppercase tracking-[0.16em]',
          tone === 'light' ? 'text-jollof' : 'text-gold',
        )}
      >
        {eyebrow}
      </motion.p>
      <Heading
        variants={stagger(0.12)}
        className={cn(
          'text-[2.5rem] leading-[1.05] md:text-6xl',
          tone === 'light' ? 'text-cocoa' : 'text-paper',
        )}
      >
        <motion.span variants={fadeUp} className="block">
          {title}
        </motion.span>
        <motion.span
          variants={fadeUp}
          className={cn(
            'block font-accent font-semibold italic tracking-normal',
            tone === 'light' ? 'text-jollof' : 'text-gold',
          )}
        >
          {accent}
        </motion.span>
      </Heading>
    </Stagger>
  )
}
