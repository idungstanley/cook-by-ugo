import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { STORY_STATS } from '@/constants/content'
import { EASE_OUT, fadeUp, IN_VIEW } from '@/constants/motion'
import { useSiteInfo } from '@/services/site/site.queries'

export const OurStory = () => {
  const { data: site } = useSiteInfo()

  return (
    <section id="our-story" className="relative overflow-hidden bg-ewedu text-paper">
      <div
        aria-hidden
        className="pattern-adire absolute bottom-0 right-0 hidden h-56 w-[28rem] lg:block"
      />
      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.12fr] lg:gap-20 lg:py-20">
        <motion.img
          initial={{ opacity: 0, x: -60, rotate: -5 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={IN_VIEW}
          transition={{ duration: 1, ease: EASE_OUT }}
          src="/images/site/our-story.jpg"
          alt="Pots of jollof rice, stew and grilled fish"
          loading="lazy"
          width={1092}
          height={1092}
          className="mx-auto w-full max-w-[540px]"
        />

        <div>
          <SectionHeading
            tone="dark"
            eyebrow="Our story"
            title="Made with love. Freshly cooked."
            accent="Just like home."
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-paper/85 md:text-lg">
              {site?.storyText}
            </p>
          </Reveal>

          <Stagger gap={0.12} delay={0.3} className="mt-8 flex gap-8 md:gap-14">
            {STORY_STATS.map(({ value, label }) => (
              <motion.dl key={label} variants={fadeUp}>
                <dt className="font-display text-3xl font-extrabold text-gold">{value}</dt>
                <dd className="text-xs text-paper/80">{label}</dd>
              </motion.dl>
            ))}
          </Stagger>

          <Reveal delay={0.4}>
            <Link
              to="/info/$slug"
              params={{ slug: 'our-story' }}
              className={buttonStyles({ variant: 'light', className: 'mt-8' })}
            >
              Read our story →
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
