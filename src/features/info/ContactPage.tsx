import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { buildWhatsappUrl } from '@/lib/whatsapp'
import { useSiteInfo } from '@/services/site/site.queries'
import { InfoPage } from './InfoPage'

const ContactCard = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) => (
  <div className="flex gap-4 rounded-card bg-paper p-5 shadow-sm">
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-soft">
      {icon}
    </span>
    <div>
      <h2 className="!mt-0 !text-lg">{title}</h2>
      <div className="text-cocoa/80">{children}</div>
    </div>
  </div>
)

export const ContactPage = () => {
  const { data: site } = useSiteInfo()

  return (
    <InfoPage
      eyebrow="Contact"
      title="Talk to"
      accent="the kitchen."
      intro="Questions about an order, an allergy or a big family event? We usually reply within the hour during opening times."
    >
      {site && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard icon={<MessageCircle className="size-5" />} title="WhatsApp">
            <a href={buildWhatsappUrl(site.whatsappNumber)} target="_blank" rel="noreferrer">
              Message us on WhatsApp
            </a>
            <p className="text-sm">The quickest way to reach us.</p>
          </ContactCard>
          <ContactCard icon={<Phone className="size-5" />} title="Phone">
            <a href={site.phoneHref}>{site.phone}</a>
            <p className="text-sm">Open today {site.todayHours}.</p>
          </ContactCard>
          <ContactCard icon={<Mail className="size-5" />} title="Email">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <p className="text-sm">For orders, refunds and anything else.</p>
          </ContactCard>
          <ContactCard icon={<MapPin className="size-5" />} title="Where we are">
            <p>{site.areaLabel}</p>
            <p className="text-sm">Delivery only, across Newcastle.</p>
          </ContactCard>
        </div>
      )}
      <p className="text-sm text-muted">
        Have an order number handy if you are asking about an order. It starts with UGO and is in
        your confirmation email.
      </p>
    </InfoPage>
  )
}
