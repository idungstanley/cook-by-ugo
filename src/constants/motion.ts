import type { Transition, Variants } from 'motion/react'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Sections animate once, when a fifth of them has scrolled into view. */
export const IN_VIEW = { once: true, amount: 0.2 } as const

export const REVEAL_TRANSITION: Transition = { duration: 0.7, ease: EASE_OUT }

export const SPRING: Transition = { type: 'spring', stiffness: 380, damping: 26 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: SPRING },
}

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
})

/** Lift and press feedback shared by cards and buttons. */
export const CARD_HOVER = { y: -6, transition: SPRING }
export const PRESS = { scale: 0.94 }
export const HOVER_GROW = { scale: 1.08, transition: SPRING }
