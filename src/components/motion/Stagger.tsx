import { motion, type HTMLMotionProps } from 'motion/react'
import { IN_VIEW, stagger } from '@/constants/motion'

interface StaggerProps extends HTMLMotionProps<'div'> {
  gap?: number
  delay?: number
  trigger?: 'inView' | 'mount'
}

/**
 * Plays its children's `hidden` → `visible` variants one after another.
 * Children opt in with `variants`, for example `fadeUp` from the motion constants.
 */
export const Stagger = ({ gap, delay, trigger = 'inView', ...props }: StaggerProps) => (
  <motion.div
    variants={stagger(gap, delay)}
    initial="hidden"
    {...(trigger === 'mount'
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: IN_VIEW })}
    {...props}
  />
)

/** The list form of `Stagger`, for `<ol>` and `<ul>`. */
export const StaggerList = ({
  gap,
  delay,
  ordered,
  ...props
}: HTMLMotionProps<'ol'> & { gap?: number; delay?: number; ordered?: boolean }) => {
  const List = ordered ? motion.ol : motion.ul

  return (
    <List
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={IN_VIEW}
      {...props}
    />
  )
}
