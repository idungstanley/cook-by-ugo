import { Link } from '@tanstack/react-router'
import { AsoOkeBand } from '@/components/brand/AsoOkeBand'
import { LogoMark } from '@/components/brand/LogoMark'
import { buttonStyles } from '@/components/ui/button.styles'
import { Container } from '@/components/ui/Container'
import { FOOTER_NAV } from '@/constants/navigation'
import { buildWhatsappUrl } from '@/lib/whatsapp'
import { useSiteInfo } from '@/services/site/site.queries'
import { navLinkProps } from './navLinkProps'

export const Footer = () => {
  const { data: site } = useSiteInfo()

  return (
    <footer className="bg-cocoa text-shea">
      <AsoOkeBand />
      <Container className="pt-14 md:pt-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <LogoMark onDark className="mb-4 size-28 md:size-28" />
            <p className="max-w-xs text-lg leading-snug">
              Authentic Nigerian home cooking, delivered across Newcastle.
            </p>
            {site && (
              <a
                href={buildWhatsappUrl(site.whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: 'whatsapp', className: 'mt-5' })}
              >
                Order on WhatsApp
              </a>
            )}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-3 gap-6 lg:gap-24">
            {FOOTER_NAV.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 font-body text-sm font-bold tracking-wider text-gold">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link {...navLinkProps(link)} className="transition hover:text-gold">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6 pb-6">
          <p
            aria-hidden
            className="font-display text-[15vw] font-extrabold leading-[0.85] tracking-tighter xl:text-[188px]"
          >
            cookedbyugo
          </p>
          <p className="hidden shrink-0 text-xs text-shea/70 lg:block">
            © {new Date().getFullYear()} Cooked by Ugo
          </p>
        </div>
        <p className="pb-6 text-xs text-shea/70 lg:hidden">
          © {new Date().getFullYear()} Cooked by Ugo
        </p>
      </Container>
    </footer>
  )
}
