import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/brand/Logo'
import { buttonStyles } from '@/components/ui/button.styles'
import { CloseButton, Drawer } from '@/components/ui/Overlay'
import { HEADER_NAV } from '@/constants/navigation'
import { buildWhatsappUrl } from '@/lib/whatsapp'
import { useSiteInfo } from '@/services/site/site.queries'
import { useUiStore } from '@/stores/ui.store'
import { navLinkProps } from './navLinkProps'

export const MobileMenu = () => {
  const open = useUiStore((state) => state.isMobileMenuOpen)
  const setOpen = useUiStore((state) => state.setMobileMenuOpen)
  const { data: site } = useSiteInfo()
  const close = () => setOpen(false)

  return (
    <Drawer open={open} onClose={close} label="Menu" className="bg-shea">
      <div className="flex items-center justify-between p-5">
        <Logo />
        <CloseButton onClick={close} className="bg-paper" />
      </div>
      <nav aria-label="Mobile" className="flex flex-1 flex-col gap-2 px-5 pt-4">
        {HEADER_NAV.map((link) => (
          <Link
            key={link.label}
            {...navLinkProps(link)}
            onClick={close}
            className="border-b border-line py-4 font-display text-3xl font-extrabold tracking-tight"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-3 p-5">
        <Link to="/menu" onClick={close} className={buttonStyles({ size: 'lg', fullWidth: true })}>
          Order now →
        </Link>
        {site && (
          <a
            href={buildWhatsappUrl(site.whatsappNumber)}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ variant: 'whatsapp', size: 'lg', fullWidth: true })}
          >
            Order on WhatsApp
          </a>
        )}
      </div>
    </Drawer>
  )
}
