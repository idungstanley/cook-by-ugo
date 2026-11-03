import { motion } from 'motion/react'
import { StaggerList } from '@/components/motion/Stagger'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { HOW_IT_WORKS_STEPS } from '@/constants/content'
import { CARD_HOVER, fadeUp, popIn } from '@/constants/motion'
import { cn } from '@/lib/cn'

export const HowItWorks = () => (
  <section className="bg-cocoa py-16 text-paper md:py-24">
    <Container>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          tone="dark"
          eyebrow="How it works"
          title="Three steps to"
          accent="a full belly."
        />
        <p className="max-w-sm text-paper/75">
          No account needed. Order in under 90 seconds, or message us on WhatsApp if you prefer.
        </p>
      </div>

      <StaggerList ordered gap={0.15} className="mt-10 grid gap-4 md:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map(({ title, body, tone }, index) => (
          <motion.li
            key={title}
            variants={fadeUp}
            whileHover={CARD_HOVER}
            className="rounded-card border border-paper/10 bg-cocoa-soft p-6"
          >
            <motion.span
              variants={popIn}
              className={cn(
                'grid size-11 place-items-center rounded-full text-sm font-bold text-white',
                tone,
              )}
            >
              0{index + 1}
            </motion.span>
            <h3 className="mt-5 text-2xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper/75">{body}</p>
          </motion.li>
        ))}
      </StaggerList>
    </Container>
  </section>
)
