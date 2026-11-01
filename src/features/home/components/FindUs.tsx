import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSiteInfo } from '@/services/site/site.queries'

export const FindUs = () => {
  const { data: site } = useSiteInfo()

  return (
    <section id="find-us" className="py-16 md:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Find us" title="Come say hello" accent="in Newcastle." />
          <p className="mt-6 max-w-md text-cocoa/80">
            Walk-ins welcome, or order online for delivery across Newcastle upon Tyne.
          </p>

          <dl className="mt-6 max-w-md">
            {site?.hours.map(({ label, hoursLabel }) => (
              <div key={label} className="flex justify-between border-b border-line py-3">
                <dt className="font-medium">{label}</dt>
                <dd className="font-bold">{hoursLabel}</dd>
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
        </div>

        <div className="relative overflow-hidden rounded-card">
          <img
            src="/images/site/find-us-map.jpg"
            alt="A car navigation screen showing the route to Cook by Ugo"
            loading="lazy"
            width={1316}
            height={908}
            className="w-full"
          />
          {site && (
            <div className="absolute bottom-[10%] left-[5.5%] w-[44%] min-w-[220px] rounded-2xl bg-paper px-4 py-3">
              <p className="font-display font-bold md:text-lg">{site.areaLabel}</p>
              <p className="text-xs text-muted">
                <a href={site.phoneHref}>{site.phone}</a> ·{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
