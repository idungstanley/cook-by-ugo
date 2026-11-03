import { motion, type HTMLMotionProps } from 'motion/react'
import { EASE_OUT, IN_VIEW } from '@/constants/motion'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  /** Start offset in pixels. Use `x` for elements that slide in from the side. */
  x?: number
  y?: number
  /** `mount` plays straight away, for content above the fold. */
  trigger?: 'inView' | 'mount'
}

/** Fades and slides its children in. */
export const Reveal = ({ delay = 0, x = 0, y = 28, trigger = 'inView', ...props }: RevealProps) => {
  const shown = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      {...(trigger === 'mount' ? { animate: shown } : { whileInView: shown, viewport: IN_VIEW })}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      {...props}
    />
  )
}
