import { Link } from '@tanstack/react-router'
import { Menu, ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { buttonStyles } from '@/components/ui/button.styles'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { IconButton } from '@/components/ui/IconButton'
import { HEADER_NAV } from '@/constants/navigation'
import { useCartTotals } from '@/hooks/useCartTotals'
import { useSiteInfo } from '@/services/site/site.queries'
import { useUiStore } from '@/stores/ui.store'
import { navLinkProps } from './navLinkProps'

export const Header = () => {
  const { itemCount } = useCartTotals()
  const { data: site } = useSiteInfo()
  const openPanel = useUiStore((state) => state.openPanel)
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen)

  return (
    <header className="sticky top-0 z-30 bg-shea/95 backdrop-blur">
      {site?.announcement && (
        <p className="bg-cocoa px-5 py-1.5 text-center text-[13px] font-semibold text-paper">
          {site.announcement}
        </p>
      )}
      <Container className="flex h-[76px] items-center justify-between gap-6 md:h-[88px]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-12 lg:flex">
          {HEADER_NAV.map((link) => (
            <Link
              key={link.label}
              {...navLinkProps(link)}
              className="text-sm font-semibold transition hover:text-jollof"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" onClick={() => openPanel('cart')}>
            Cart · {itemCount}
          </Button>
          <Link to="/menu" className={buttonStyles({ variant: 'dark' })}>
            Order now
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <IconButton
            label={`Open cart, ${itemCount} items`}
            className="relative border border-line bg-paper"
            onClick={() => openPanel('cart')}
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-jollof text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </IconButton>
          <IconButton
            label="Open menu"
            className="bg-cocoa text-paper hover:bg-cocoa-soft"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-5" />
          </IconButton>
        </div>
      </Container>
    </header>
  )
}
