import { Link } from '@tanstack/react-router'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { STORY_STATS } from '@/constants/content'
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
        <img
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
            title="Rooted in Lagos,"
            accent="made for everyone."
          />
          <p className="mt-6 max-w-xl leading-relaxed text-paper/85 md:text-lg">
            {site?.storyText}
          </p>

          <dl className="mt-8 flex gap-8 md:gap-14">
            {STORY_STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="font-display text-3xl font-extrabold text-gold">{value}</dt>
                <dd className="text-xs text-paper/80">{label}</dd>
              </div>
            ))}
          </dl>

          <Link
            to="/info/$slug"
            params={{ slug: 'our-story' }}
            className={buttonStyles({ variant: 'light', className: 'mt-8' })}
          >
            Read our story →
          </Link>
        </div>
      </Container>
    </section>
  )
}
