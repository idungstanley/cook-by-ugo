import { motion } from 'motion/react'
import { Reveal } from '@/components/motion/Reveal'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE_OUT, IN_VIEW } from '@/constants/motion'
import { useSiteInfo } from '@/services/site/site.queries'

export const FindUs = () => {
  const { data: site } = useSiteInfo()

  return (
    <section id="find-us" className="overflow-x-clip py-16 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Find us" title="Come say hello" accent="in Newcastle." />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-cocoa/80">
              Walk-ins welcome, or order online for delivery across Newcastle upon Tyne.
            </p>

            <dl className="mt-6 max-w-md">
              {site?.hours.map(({ label, hoursLabel }) => (
                <div
                  key={label}
                  className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-line py-3"
                >
                  <dt className="font-medium">{label}</dt>
                  <dd className="font-bold tabular-nums">{hoursLabel}</dd>
                </div>
              ))}
            </dl>

            {site && (
              <a
                href={site.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: 'dark', className: 'mt-6' })}
              >
                Get directions →
              </a>
            )}
          </Reveal>
        </div>

        <Reveal x={60} y={0} className="relative overflow-hidden rounded-card">
          <img
            src="/images/site/find-us-map.jpg"
            alt="A car navigation screen showing the route to Cooked by Ugo"
            loading="lazy"
            width={1316}
            height={908}
            className="w-full"
          />
          {site && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={IN_VIEW}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 }}
              className="absolute bottom-[10%] left-[5.5%] w-[44%] min-w-[220px] rounded-2xl bg-paper px-4 py-3"
            >
              <p className="font-display font-bold md:text-lg">{site.areaLabel}</p>
              <p className="text-xs text-muted">
                <a href={site.phoneHref}>{site.phone}</a> ·{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </motion.div>
          )}
        </Reveal>
      </Container>
    </section>
  )
}
